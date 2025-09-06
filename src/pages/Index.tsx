import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import References from '@/components/References';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <References />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
