# PRD — Semillas Nómadas (Tienda de joyería artesanal)

## Problema original
> "Un sitio Weg para mi negocio, vendo Artesanias de joyeria y de mas con elementos de la naturaleza reciclados y Resina. Quiero venderlas por internet."

User requested e-commerce online store. Brand name "Semillas Nómadas" (chosen by user, work-in-progress — wordplay around seeds + nomadic preservation of nature).

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT auth + bcrypt for admin. PayPal REST API integration with demo-mode fallback.
- **Frontend**: React 19 + Tailwind + Shadcn UI. Cart via React Context. PayPal smart buttons via @paypal/react-paypal-js.
- **Design**: Organic/Earthy archetype. Cormorant Garamond + Outfit. Forest-green primary, sand background, clay & amber accents.

## User personas
- **Comprador final**: descubre piezas únicas, agrega a canasta, paga con PayPal, recibe a domicilio.
- **Administradora (artesana)**: ingresa al panel, gestiona productos (CRUD), revisa órdenes y estadísticas.

## Core requirements
- Catálogo público con filtros por categoría
- Detalle de producto con galería y materiales
- Carrito drawer con cantidades
- Checkout con PayPal (demo mode + real cuando se configuren credenciales)
- Panel admin protegido (JWT)
- WhatsApp flotante para contacto rápido

## Implemented (Feb 2026 – iter 1)
- ✅ Landing/Home con hero, valores, productos destacados, story teaser
- ✅ /catalogo con filtros (Todo, Collares, Dijes, Aretes, Anillos, Pulseras)
- ✅ /producto/:id con add-to-cart
- ✅ /historia (about/sustentabilidad)
- ✅ /contacto con CTA WhatsApp + personalización
- ✅ Carrito (Sheet) con qty +/-, remove, subtotal
- ✅ /checkout con form + PayPal Buttons reales O Demo Pay button
- ✅ Backend: products CRUD, orders, paypal create/capture, admin stats
- ✅ Auth admin JWT + bcrypt, seed admin@semillasnomadas.com / admin123
- ✅ 8 productos sample seedeados al arrancar
- ✅ /admin/login + /admin dashboard (stats, products table CRUD via Dialog, orders table)
- ✅ Floating WhatsApp button
- ✅ 100% backend + frontend tests passed (testing_agent_v3 iter 1)

## Backlog (P0)
- Configurar PAYPAL_CLIENT_ID y PAYPAL_SECRET reales (sandbox)
- Reemplazar imágenes de stock con fotos reales de los productos
- Configurar dominio + número WhatsApp real (variable WHATSAPP_NUMBER)

## Backlog (P1)
- Múltiples imágenes por producto (galería en detalle)
- Sistema de variantes (talla anillo, largo cadena)
- Cupones / descuentos
- Email de confirmación al cliente (Resend/SendGrid)
- Subida de imágenes desde el admin (object storage)

## Backlog (P2)
- Reseñas / testimonios
- Newsletter
- Wishlist
- Producción/back-stock al agotarse
- Dashboard analytics más detallado
- Soporte multi-idioma (EN/ES)

## Mock / Demo notes
- ⚠️ **PayPal en MODO DEMO**: sin credenciales, "Pagar (Modo Demo)" simula el flujo y marca la orden como `paid`. Configurar variables `PAYPAL_CLIENT_ID` y `PAYPAL_SECRET` en backend/.env para activar pagos reales.
- ⚠️ Imágenes son de Unsplash (stock).
- ⚠️ Número WhatsApp es placeholder `525555555555`.

## Credenciales
Ver `/app/memory/test_credentials.md`.
