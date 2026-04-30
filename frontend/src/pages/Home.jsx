import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const HERO_IMG = 'https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800';
const STORY_IMG = 'https://images.unsplash.com/photo-1759523131742-af817477bcd9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products', { params: { featured: true } }).then((r) => setFeatured(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <main data-testid="home-page">
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] grain overflow-hidden">
        <img src={HERO_IMG} alt="Resina sobre madera" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(44,64,43,0.78) 0%, rgba(44,64,43,0.45) 50%, rgba(44,64,43,0.10) 100%)' }} />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center">
          <div className="max-w-2xl text-sand animate-fade-up">
            <p className="overline text-amber mb-6">Joyería artesanal · Naturaleza · Resina</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              Cada semilla,<br/>
              <em className="not-italic text-amber">una historia</em><br/>
              que viaja contigo.
            </h1>
            <p className="text-base sm:text-lg text-sand/85 max-w-xl mb-10 leading-relaxed">
              Joyería única hecha a mano con elementos de la naturaleza reciclados, preservados eternamente en resina cristalina.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogo" className="btn-primary bg-amber text-ink hover:bg-sand" data-testid="hero-cta-catalog">
                Ver colección <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/historia" className="btn-outline border-sand text-sand hover:bg-sand hover:text-forest" data-testid="hero-cta-story">
                Nuestra historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="py-20 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          {[
            { icon: Leaf, title: 'Naturaleza reciclada', text: 'Hojas, flores, semillas y maderas recolectadas con consciencia.' },
            { icon: Sparkles, title: 'Resina cristalina', text: 'Técnica artesanal que preserva la belleza efímera para siempre.' },
            { icon: Heart, title: 'Pieza única', text: 'Ningún elemento natural se repite. Cada joya es irrepetible.' },
          ].map((v, idx) => (
            <div key={idx} className="flex gap-5">
              <v.icon className="w-7 h-7 text-forest flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-2xl text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-muted2 leading-relaxed">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="overline text-clay mb-3">Selección curada</p>
              <h2 className="font-serif text-4xl sm:text-5xl text-forest tracking-tight">Piezas destacadas</h2>
            </div>
            <Link to="/catalogo" className="text-sm text-forest underline underline-offset-4 hover:text-clay" data-testid="see-all-featured">
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* STORY TEASER (Bento) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 lg:col-span-7">
            <div className="aspect-[5/4] overflow-hidden">
              <img src={STORY_IMG} alt="Taller artesanal" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-5 md:pl-6">
            <p className="overline text-clay mb-4">Nuestra esencia</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-forest tracking-tight mb-6 leading-[1.05]">
              Las semillas viajan,<br/>
              <em className="not-italic text-clay">la naturaleza permanece</em>.
            </h2>
            <p className="text-base text-muted2 leading-relaxed mb-8">
              En cada gota de resina capturamos un instante: una hoja del otoño pasado, una flor recogida en una caminata, una corteza que el viento dejó en nuestro camino. Materiales recolectados con respeto, transformados en joyas que cuentan tu historia.
            </p>
            <Link to="/historia" className="btn-outline" data-testid="story-cta">Conocer la historia</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
