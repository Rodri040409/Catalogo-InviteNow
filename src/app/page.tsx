'use client';

import Hero from './components/Hero';
import Creadores from './components/Creadores';
import Footer from './components/Footer';


export default function HomePage() {
  return (
    <main className='min-h-screen flex flex-col'>
      <Hero />
      <Creadores />
      <Footer />
    </main>
  );
}
