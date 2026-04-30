import React from 'react';
import { Link } from 'react-router-dom';

const STORY_IMG = 'https://images.unsplash.com/photo-1742559008386-16198f98e2b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600';
const ART_IMG = 'https://images.unsplash.com/photo-1759523131742-af817477bcd9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';

const Story = () => (
  <main className="py-16 md:py-24" data-testid="story-page">
    <div className="max-w-4xl mx-auto px-6 lg:px-10 mb-16">
      <p className="overline text-clay mb-4">La historia</p>
      <h1 className="font-serif text-5xl md:text-7xl text-forest tracking-tight leading-[1.02] mb-6">
        Semillas que viajan,<br/>
        <em className="not-italic text-clay">raíces que perduran</em>.
      </h1>
      <p className="text-lg text-muted2 leading-relaxed">
        Semillas Nómadas nació de la idea de que la naturaleza, aunque efímera, puede ser preservada como un instante eterno. Cada hoja, flor o semilla que recolectamos cuenta una historia: del bosque que la vio crecer, del viento que la trajo, del momento en que se cruzó con nosotras.
      </p>
    </div>

    <section className="grain">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <img src={STORY_IMG} alt="Bosque y musgo" className="w-full h-[500px] object-cover" />
        </div>
        <div className="md:col-span-5 md:pl-6 flex flex-col justify-center">
          <p className="overline text-clay mb-3">Nuestra técnica</p>
          <h2 className="font-serif text-4xl text-forest mb-4 leading-tight">Resina cristalina, técnica artesanal</h2>
          <p className="text-muted2 leading-relaxed mb-4">
            Trabajamos con resina epóxica de alta pureza, encapsulando los elementos naturales en capas que resaltan su belleza. Un proceso que toma días: secado, posición, vertido, curado, pulido.
          </p>
          <p className="text-muted2 leading-relaxed">
            Cada pieza es irrepetible porque ningún elemento natural se repite jamás.
          </p>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5">
          <p className="overline text-clay mb-3">Sustentabilidad</p>
          <h2 className="font-serif text-4xl text-forest mb-4 leading-tight">Naturaleza reciclada, no extraída</h2>
          <p className="text-muted2 leading-relaxed mb-4">
            Sólo trabajamos con materiales que la naturaleza ya nos entregó: hojas caídas, flores secas, cortezas desprendidas, semillas dispersadas. Nunca cortamos ni dañamos plantas vivas.
          </p>
          <ul className="space-y-2 text-sm text-muted2 list-disc pl-5">
            <li>Materiales 100% recolectados de manera consciente</li>
            <li>Empaque biodegradable y reciclado</li>
            <li>Producción en pequeños lotes, sin desperdicio</li>
          </ul>
        </div>
        <div className="md:col-span-7">
          <img src={ART_IMG} alt="Taller artesanal" className="w-full h-[500px] object-cover" />
        </div>
      </div>
    </section>

    <section className="bg-forest text-sand py-20 grain">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Una pieza, una historia que viaja contigo.</h2>
        <p className="text-sand/80 mb-8 leading-relaxed">Descubre la colección y elige la semilla que se quedará en tu camino.</p>
        <Link to="/catalogo" className="btn-primary bg-amber text-ink hover:bg-sand hover:text-forest" data-testid="story-cta-catalog">
          Ver colección
        </Link>
      </div>
    </section>
  </main>
);

export default Story;
