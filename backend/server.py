from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import bcrypt
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'dev_secret')
JWT_ALGO = 'HS256'
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@semillasnomadas.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID', '')
PAYPAL_SECRET = os.environ.get('PAYPAL_SECRET', '')
PAYPAL_ENV = os.environ.get('PAYPAL_ENV', 'sandbox')
PAYPAL_BASE = 'https://api-m.sandbox.paypal.com' if PAYPAL_ENV == 'sandbox' else 'https://api-m.paypal.com'

app = FastAPI()
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)


# ============= MODELS =============
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    category: str  # anillos, aretes, collares, pulseras, dijes
    description: str
    price: float
    images: List[str] = []
    materials: List[str] = []
    stock: int = 10
    featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ProductCreate(BaseModel):
    name: str
    slug: str
    category: str
    description: str
    price: float
    images: List[str] = []
    materials: List[str] = []
    stock: int = 10
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    stock: Optional[int] = None
    featured: Optional[bool] = None


class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = ''
    shipping_address: str
    items: List[CartItem]
    notes: Optional[str] = ''


class CustomOrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = ''
    jewelry_type: str  # collar, dije, anillo, aretes, pulsera, otro
    element_description: str  # qué elemento natural quieren preservar
    inspiration_url: Optional[str] = ''  # foto referencia
    budget: str  # rango: '50-80', '80-120', '120-200', '200+'
    deadline: Optional[str] = ''
    notes: Optional[str] = ''


class CustomOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_phone: str = ''
    jewelry_type: str
    element_description: str
    inspiration_url: str = ''
    budget: str
    deadline: str = ''
    notes: str = ''
    status: str = 'nuevo'  # nuevo, contactado, cotizado, en_proceso, completado, cancelado
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class StatusUpdate(BaseModel):
    status: str


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_phone: str = ''
    shipping_address: str
    items: List[CartItem]
    notes: str = ''
    subtotal: float
    status: str = 'pending'  # pending, paid, fulfilled, cancelled
    payment_method: str = 'paypal'
    payment_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    token: str
    email: str


# ============= AUTH HELPERS =============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(email: str) -> str:
    payload = {'email': email, 'exp': datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def require_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401, detail='Unauthorized')
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        admin = await db.admins.find_one({'email': payload.get('email')}, {'_id': 0})
        if not admin:
            raise HTTPException(status_code=401, detail='Invalid token')
        return admin
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail='Invalid token')


# ============= ROUTES =============
@api_router.get("/")
async def root():
    return {"message": "Semillas Nómadas API", "status": "ok"}


# ----- AUTH -----
@api_router.post("/auth/login", response_model=TokenOut)
async def login(payload: LoginIn):
    admin = await db.admins.find_one({'email': payload.email}, {'_id': 0})
    if not admin or not verify_password(payload.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail='Credenciales inválidas')
    return TokenOut(token=create_token(admin['email']), email=admin['email'])


@api_router.get("/auth/me")
async def me(admin=Depends(require_admin)):
    return {'email': admin['email']}


# ----- PRODUCTS -----
@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    q = {}
    if category and category != 'all':
        q['category'] = category
    if featured is not None:
        q['featured'] = featured
    items = await db.products.find(q, {'_id': 0}).sort('created_at', -1).to_list(500)
    return items


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    p = await db.products.find_one({'id': product_id}, {'_id': 0})
    if not p:
        raise HTTPException(status_code=404, detail='Producto no encontrado')
    return p


@api_router.post("/products", response_model=Product)
async def create_product(payload: ProductCreate, admin=Depends(require_admin)):
    p = Product(**payload.model_dump())
    await db.products.insert_one(p.model_dump())
    return p


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, payload: ProductUpdate, admin=Depends(require_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail='Sin cambios')
    await db.products.update_one({'id': product_id}, {'$set': updates})
    p = await db.products.find_one({'id': product_id}, {'_id': 0})
    if not p:
        raise HTTPException(status_code=404, detail='Producto no encontrado')
    return p


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(require_admin)):
    res = await db.products.delete_one({'id': product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Producto no encontrado')
    return {'ok': True}


# ----- ORDERS -----
@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    subtotal = sum(i.price * i.quantity for i in payload.items)
    order = Order(
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone or '',
        shipping_address=payload.shipping_address,
        items=payload.items,
        notes=payload.notes or '',
        subtotal=round(subtotal, 2),
    )
    doc = order.model_dump()
    # serialize CartItem list
    doc['items'] = [i.model_dump() if hasattr(i, 'model_dump') else i for i in doc['items']]
    await db.orders.insert_one(doc)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders(admin=Depends(require_admin)):
    items = await db.orders.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)
    return items


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    o = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not o:
        raise HTTPException(status_code=404, detail='Orden no encontrada')
    return o


# ----- CUSTOM ORDERS -----
@api_router.post("/custom-orders", response_model=CustomOrder)
async def create_custom_order(payload: CustomOrderCreate):
    co = CustomOrder(**payload.model_dump())
    await db.custom_orders.insert_one(co.model_dump())
    return co


@api_router.get("/custom-orders", response_model=List[CustomOrder])
async def list_custom_orders(admin=Depends(require_admin)):
    items = await db.custom_orders.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)
    return items


@api_router.patch("/custom-orders/{co_id}", response_model=CustomOrder)
async def update_custom_order_status(co_id: str, payload: StatusUpdate, admin=Depends(require_admin)):
    await db.custom_orders.update_one({'id': co_id}, {'$set': {'status': payload.status}})
    co = await db.custom_orders.find_one({'id': co_id}, {'_id': 0})
    if not co:
        raise HTTPException(status_code=404, detail='Solicitud no encontrada')
    return co


# ----- PAYPAL -----
async def paypal_token() -> Optional[str]:
    if not (PAYPAL_CLIENT_ID and PAYPAL_SECRET):
        return None
    async with httpx.AsyncClient() as cli:
        r = await cli.post(
            f'{PAYPAL_BASE}/v1/oauth2/token',
            auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
            data={'grant_type': 'client_credentials'},
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=20,
        )
        r.raise_for_status()
        return r.json()['access_token']


@api_router.get("/paypal/config")
async def paypal_config():
    return {
        'client_id': PAYPAL_CLIENT_ID,
        'env': PAYPAL_ENV,
        'enabled': bool(PAYPAL_CLIENT_ID and PAYPAL_SECRET),
    }


@api_router.post("/paypal/create-order/{order_id}")
async def paypal_create_order(order_id: str):
    order = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail='Orden no encontrada')
    token = await paypal_token()
    if not token:
        # Demo mode: simulate success
        fake_id = f'DEMO-{uuid.uuid4().hex[:10].upper()}'
        return {'id': fake_id, 'demo': True}
    async with httpx.AsyncClient() as cli:
        r = await cli.post(
            f'{PAYPAL_BASE}/v2/checkout/orders',
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
            json={
                'intent': 'CAPTURE',
                'purchase_units': [{
                    'reference_id': order['id'],
                    'amount': {'currency_code': 'USD', 'value': f"{order['subtotal']:.2f}"},
                }],
            },
            timeout=20,
        )
        r.raise_for_status()
        data = r.json()
        return {'id': data['id'], 'demo': False}


@api_router.post("/paypal/capture/{order_id}")
async def paypal_capture(order_id: str, payload: dict):
    paypal_order_id = payload.get('paypal_order_id')
    if not paypal_order_id:
        raise HTTPException(status_code=400, detail='paypal_order_id requerido')
    order = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail='Orden no encontrada')

    token = await paypal_token()
    if not token or paypal_order_id.startswith('DEMO-'):
        # Demo capture
        await db.orders.update_one(
            {'id': order_id},
            {'$set': {'status': 'paid', 'payment_id': paypal_order_id}}
        )
        return {'ok': True, 'status': 'paid', 'demo': True}

    async with httpx.AsyncClient() as cli:
        r = await cli.post(
            f'{PAYPAL_BASE}/v2/checkout/orders/{paypal_order_id}/capture',
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
            timeout=20,
        )
        r.raise_for_status()
        data = r.json()
        await db.orders.update_one(
            {'id': order_id},
            {'$set': {'status': 'paid', 'payment_id': paypal_order_id}}
        )
        return {'ok': True, 'status': 'paid', 'paypal': data}


# ----- STATS -----
@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(require_admin)):
    products_count = await db.products.count_documents({})
    orders_count = await db.orders.count_documents({})
    paid_orders = await db.orders.find({'status': 'paid'}, {'_id': 0, 'subtotal': 1}).to_list(1000)
    revenue = sum(o.get('subtotal', 0) for o in paid_orders)
    custom_count = await db.custom_orders.count_documents({})
    custom_new = await db.custom_orders.count_documents({'status': 'nuevo'})
    return {
        'products': products_count,
        'orders': orders_count,
        'paid_orders': len(paid_orders),
        'revenue': round(revenue, 2),
        'custom_orders': custom_count,
        'custom_new': custom_new,
    }


# ============= SEED DATA =============
SAMPLE_PRODUCTS = [
    {
        'name': 'Dije Hoja Dorada',
        'slug': 'dije-hoja-dorada',
        'category': 'dijes',
        'description': 'Dije con una hoja real preservada en resina cristalina, bañado en oro. Cada pieza es única.',
        'price': 29.00,
        'images': [
            'https://images.unsplash.com/photo-1610918122969-b6cbbc2bdc08?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Resina epóxica', 'Hoja natural', 'Baño de oro'],
        'stock': 8,
        'featured': True,
    },
    {
        'name': 'Collar Corazón Botánico',
        'slug': 'collar-corazon-botanico',
        'category': 'collares',
        'description': 'Collar en forma de corazón con flores silvestres en su interior. Cadena de plata 925.',
        'price': 38.00,
        'images': [
            'https://images.unsplash.com/photo-1630628123261-72dd7c75bc02?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Plata 925', 'Resina', 'Flores silvestres'],
        'stock': 5,
        'featured': True,
    },
    {
        'name': 'Collar Luna Negra',
        'slug': 'collar-luna-negra',
        'category': 'collares',
        'description': 'Collar redondo con musgo y elementos de bosque sobre fondo negro. Misterio natural.',
        'price': 34.00,
        'images': [
            'https://images.unsplash.com/photo-1610819739861-bc4b791da150?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Plata', 'Resina', 'Musgo seco'],
        'stock': 6,
        'featured': True,
    },
    {
        'name': 'Aretes Pétalos de Verano',
        'slug': 'aretes-petalos-verano',
        'category': 'aretes',
        'description': 'Aretes ligeros con pétalos de margaritas reales. Perfectos para el día a día.',
        'price': 22.00,
        'images': [
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Resina', 'Pétalos naturales', 'Aro de plata'],
        'stock': 12,
        'featured': False,
    },
    {
        'name': 'Anillo Bosque Eterno',
        'slug': 'anillo-bosque-eterno',
        'category': 'anillos',
        'description': 'Anillo con miniatura de bosque preservado en resina, sobre una base de madera de pino recuperada. Una ventana a la naturaleza en tu mano.',
        'price': 26.00,
        'images': [
            'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Resina', 'Madera de pino recuperada', 'Acero inoxidable'],
        'stock': 7,
        'featured': True,
    },
    {
        'name': 'Pulsera Semillas Viajeras',
        'slug': 'pulsera-semillas-viajeras',
        'category': 'pulseras',
        'description': 'Pulsera con semillas auténticas recolectadas de viajes, encapsuladas en resina dorada.',
        'price': 24.00,
        'images': [
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Resina', 'Semillas', 'Cordón encerado'],
        'stock': 10,
        'featured': False,
    },
    {
        'name': 'Dije Gota de Ámbar',
        'slug': 'dije-gota-ambar',
        'category': 'dijes',
        'description': 'Dije en forma de gota con tonos ámbar y partículas de oro. Inspirado en la savia ancestral.',
        'price': 31.00,
        'images': [
            'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Resina ámbar', 'Hoja de oro', 'Plata'],
        'stock': 9,
        'featured': False,
    },
    {
        'name': 'Aretes Corteza',
        'slug': 'aretes-corteza',
        'category': 'aretes',
        'description': 'Aretes con madera recuperada de olivos que ya habían caído, preservada en resina. Cada par es único.',
        'price': 25.00,
        'images': [
            'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
        ],
        'materials': ['Madera de olivo recuperada', 'Resina', 'Plata 925'],
        'stock': 11,
        'featured': False,
    },
]


@app.on_event("startup")
async def seed_db():
    # Seed admin
    existing = await db.admins.find_one({'email': ADMIN_EMAIL})
    if not existing:
        await db.admins.insert_one({
            'email': ADMIN_EMAIL,
            'password_hash': hash_password(ADMIN_PASSWORD),
            'created_at': datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f'Admin seeded: {ADMIN_EMAIL}')
    # Seed products
    count = await db.products.count_documents({})
    if count == 0:
        for p in SAMPLE_PRODUCTS:
            prod = Product(**p)
            await db.products.insert_one(prod.model_dump())
        logger.info(f'Seeded {len(SAMPLE_PRODUCTS)} products')


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
