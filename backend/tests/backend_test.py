"""Backend API tests for Semillas Nómadas e-commerce."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # fallback to frontend .env
    from pathlib import Path
    env_path = Path('/app/frontend/.env')
    for line in env_path.read_text().splitlines():
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
            break

API = f"{BASE_URL}/api"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@semillasnomadas.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------------- HEALTH ----------------
def test_health(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


# ---------------- PRODUCTS ----------------
def test_list_products_seeded(session):
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 8, f"Expected >=8 seeded products, got {len(data)}"


def test_filter_by_category_collares(session):
    r = session.get(f"{API}/products", params={"category": "collares"})
    assert r.status_code == 200
    data = r.json()
    assert all(p["category"] == "collares" for p in data)
    assert len(data) >= 1


def test_filter_featured_true(session):
    r = session.get(f"{API}/products", params={"featured": "true"})
    assert r.status_code == 200
    data = r.json()
    assert all(p["featured"] == True for p in data)  # noqa: E712


def test_get_single_product(session):
    r = session.get(f"{API}/products")
    pid = r.json()[0]["id"]
    r2 = session.get(f"{API}/products/{pid}")
    assert r2.status_code == 200
    assert r2.json()["id"] == pid


# ---------------- AUTH ----------------
def test_login_success(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    j = r.json()
    assert "token" in j and j["email"] == ADMIN_EMAIL


def test_login_bad_password(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_auth_me(session, auth_headers):
    r = session.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_auth_me_no_token(session):
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


# ---------------- ADMIN PRODUCT CRUD ----------------
def test_product_crud_flow(session, auth_headers):
    payload = {
        "name": "TEST_Producto",
        "slug": "test-producto",
        "category": "anillos",
        "description": "Test product",
        "price": 19.99,
        "images": ["https://example.com/i.jpg"],
        "materials": ["resina"],
        "stock": 5,
        "featured": False,
    }
    r = session.post(f"{API}/products", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    p = r.json()
    pid = p["id"]
    assert p["name"] == "TEST_Producto"

    # GET
    r2 = session.get(f"{API}/products/{pid}")
    assert r2.status_code == 200 and r2.json()["price"] == 19.99

    # UPDATE
    r3 = session.put(f"{API}/products/{pid}", json={"price": 25.50}, headers=auth_headers)
    assert r3.status_code == 200 and r3.json()["price"] == 25.50

    # verify persisted
    r4 = session.get(f"{API}/products/{pid}")
    assert r4.json()["price"] == 25.50

    # DELETE
    r5 = session.delete(f"{API}/products/{pid}", headers=auth_headers)
    assert r5.status_code == 200

    # verify gone
    r6 = session.get(f"{API}/products/{pid}")
    assert r6.status_code == 404


def test_create_product_unauthorized(session):
    r = session.post(f"{API}/products", json={"name": "x", "slug": "x", "category": "a", "description": "b", "price": 1.0})
    assert r.status_code == 401


# ---------------- ORDERS ----------------
@pytest.fixture(scope="module")
def created_order(session):
    products = session.get(f"{API}/products").json()
    p = products[0]
    payload = {
        "customer_name": "TEST Cliente",
        "customer_email": "test@example.com",
        "customer_phone": "1234",
        "shipping_address": "Calle Falsa 123",
        "items": [{"product_id": p["id"], "name": p["name"], "price": p["price"], "quantity": 2, "image": p["images"][0] if p["images"] else None}],
        "notes": "test",
    }
    r = session.post(f"{API}/orders", json=payload)
    assert r.status_code == 200, r.text
    return r.json()


def test_create_order(created_order):
    assert created_order["status"] == "pending"
    assert created_order["subtotal"] > 0
    assert len(created_order["items"]) == 1


def test_list_orders_admin(session, auth_headers):
    r = session.get(f"{API}/orders", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_list_orders_unauthorized(session):
    r = session.get(f"{API}/orders")
    assert r.status_code == 401


# ---------------- PAYPAL DEMO ----------------
def test_paypal_config(session):
    r = session.get(f"{API}/paypal/config")
    assert r.status_code == 200
    j = r.json()
    assert "enabled" in j and "env" in j


def test_paypal_create_and_capture_demo(session, created_order, auth_headers):
    oid = created_order["id"]
    r = session.post(f"{API}/paypal/create-order/{oid}")
    assert r.status_code == 200, r.text
    j = r.json()
    assert j.get("demo") == True  # noqa: E712
    assert j["id"].startswith("DEMO-")
    paypal_id = j["id"]

    r2 = session.post(f"{API}/paypal/capture/{oid}", json={"paypal_order_id": paypal_id})
    assert r2.status_code == 200
    assert r2.json()["status"] == "paid"

    # verify order marked paid
    r3 = session.get(f"{API}/orders/{oid}")
    assert r3.json()["status"] == "paid"


# ---------------- STATS ----------------
def test_admin_stats(session, auth_headers):
    r = session.get(f"{API}/admin/stats", headers=auth_headers)
    assert r.status_code == 200
    j = r.json()
    for k in ("products", "orders", "paid_orders", "revenue", "custom_orders", "custom_new"):
        assert k in j, f"Missing key in stats: {k}"
    assert j["products"] >= 8


# ---------------- CUSTOM ORDERS ----------------
@pytest.fixture(scope="module")
def created_custom_order(session):
    payload = {
        "customer_name": "TEST Custom Cliente",
        "customer_email": "testcustom@example.com",
        "customer_phone": "5512345678",
        "jewelry_type": "collar",
        "element_description": "Una flor de lavanda de mi jardín",
        "inspiration_url": "https://example.com/inspo.jpg",
        "budget": "80-120",
        "deadline": "marzo 2026",
        "notes": "Prefiero cadena de plata",
    }
    r = session.post(f"{API}/custom-orders", json=payload)
    assert r.status_code == 200, r.text
    return r.json()


def test_create_custom_order(created_custom_order):
    co = created_custom_order
    assert co["status"] == "nuevo"
    assert co["customer_email"] == "testcustom@example.com"
    assert co["jewelry_type"] == "collar"
    assert co["budget"] == "80-120"
    assert "id" in co and isinstance(co["id"], str)
    assert co["element_description"] == "Una flor de lavanda de mi jardín"


def test_list_custom_orders_admin(session, auth_headers, created_custom_order):
    r = session.get(f"{API}/custom-orders", headers=auth_headers)
    assert r.status_code == 200
    lst = r.json()
    assert isinstance(lst, list)
    ids = [c["id"] for c in lst]
    assert created_custom_order["id"] in ids


def test_list_custom_orders_unauthorized(session):
    r = session.get(f"{API}/custom-orders")
    assert r.status_code == 401


def test_update_custom_order_status(session, auth_headers, created_custom_order):
    coid = created_custom_order["id"]
    r = session.patch(f"{API}/custom-orders/{coid}", json={"status": "contactado"}, headers=auth_headers)
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "contactado"

    # persistence check via list
    r2 = session.get(f"{API}/custom-orders", headers=auth_headers)
    found = next((c for c in r2.json() if c["id"] == coid), None)
    assert found is not None and found["status"] == "contactado"


def test_update_custom_order_unauthorized(session, created_custom_order):
    coid = created_custom_order["id"]
    r = session.patch(f"{API}/custom-orders/{coid}", json={"status": "contactado"})
    assert r.status_code == 401


def test_create_custom_order_missing_required(session):
    # missing element_description
    r = session.post(f"{API}/custom-orders", json={
        "customer_name": "X", "customer_email": "x@x.com",
        "jewelry_type": "collar", "budget": "50-80",
    })
    assert r.status_code in (400, 422)


def test_admin_stats_custom_reflects(session, auth_headers, created_custom_order):
    r = session.get(f"{API}/admin/stats", headers=auth_headers)
    j = r.json()
    assert j["custom_orders"] >= 1
