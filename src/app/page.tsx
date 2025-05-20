'use client';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';


export default function HomePage() {
  return (
    <main className='min-h-screen flex flex-col'>
      <Header />
      <Main />
      <Footer />
    </main>
  );
}
