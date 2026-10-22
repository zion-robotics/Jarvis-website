import React, { useState, useEffect, FC, ReactNode, CSSProperties, FormEvent } from 'react';

const useScrollPosition = (): number => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    let requestRunning: number | null = null;

    const handleScroll = () => {
      if (requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          setScrollPosition(window.pageYOffset);
          requestRunning = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRunning !== null) {
        window.cancelAnimationFrame(requestRunning);
      }
    };
  }, []);

  return scrollPosition;
};

interface ParallaxLayerProps {
  speed: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ParallaxLayer: FC<ParallaxLayerProps> = ({ speed, children, className = '', style = {} }) => {
  const scrollY = useScrollPosition();
  const translateY = scrollY * speed;

  return (
    <div
      className={`parallax-layer ${className}`}
      style={{
        transform: `translate3d(0, ${translateY}px, 0)`,
        willChange: 'transform',
        transition: 'transform 0.05s linear',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const injectGlobalStyles = (): void => {
  if (typeof document === 'undefined') return;
  const styleId = 'parallax-boilerplate-styles';
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.innerHTML = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    body { background-color: #0b0f19; color: #f1f5f9; overflow-x: hidden; }
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(11, 15, 25, 0.8); backdrop-filter: blur(12px); display: flex; justify-content: space-between; padding: 1.25rem 2.5rem; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    nav .logo { font-size: 1.5rem; font-weight: 700; color: #38bdf8; letter-spacing: -0.025em; }
    nav .nav-links a { color: #94a3b8; text-decoration: none; margin-left: 2rem; font-weight: 500; transition: color 0.2s ease; }
    nav .nav-links a:hover { color: #38bdf8; }
    .hero { position: relative; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .hero-bg { position: absolute; top: -20%; left: 0; width: 100%; height: 140%; background-size: cover; background-position: center; z-index: 1; filter: brightness(0.6); }
    .hero-content { position: relative; z-index: 2; text-align: center; max-width: 800px; padding: 0 1.5rem; }
    .hero h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 1.25rem; background: linear-gradient(135deg, #ffffff 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 1.25rem; margin-bottom: 2.5rem; color: #94a3b8; line-height: 1.6; }
    .btn { display: inline-block; padding: 0.875rem 2.25rem; background: #38bdf8; color: #0b0f19; font-weight: 600; border-radius: 9999px; text-decoration: none; transition: transform 0.2s ease, background-color 0.2s ease; }
    .btn:hover { transform: translateY(-2px); background: #7dd3fc; }
    section { position: relative; min-height: 100vh; padding: 8rem 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .section-content { max-width: 1200px; width: 100%; z-index: 2; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .card { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); padding: 2.5rem; border-radius: 16px; backdrop-filter: blur(8px); }
    .card h3 { color: #38bdf8; margin-bottom: 1rem; font-size: 1.5rem; }
    .card p { color: #94a3b8; line-height: 1.7; }
    .interlude { position: relative; height: 70vh; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
    .interlude-bg { position: absolute; top: -30%; left: 0; width: 100%; height: 160%; background-size: cover; background-position: center; filter: brightness(0.5); }
    form { display: flex; flex-direction: column; gap: 1.25rem; }
    input, textarea { width: 100%; padding: 1rem 1.25rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.6); color: #fff; outline: none; font-size: 1rem; }
    input:focus, textarea:focus { border-color: #38bdf8; }
    footer { padding: 4rem 2rem; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #64748b; background: #070a12; }
  `;
  document.head.appendChild(styleElement);
};

export const App: FC = () => {
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  const scrollY = useScrollPosition();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  };

  return (
    <div className="app-container">
      <nav>
        <div className="logo">Parallax.js</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#showcase">Showcase</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')`,
            transform: `translate3d(0, ${scrollY * 0.4}px, 0)`,
          }}
        />
        <div
          className="hero-content"
          style={{
            transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
            opacity: Math.max(0, 1 - scrollY / 600),
          }}
        >
          <h1>Next Generation Website Architecture</h1>
          <p>A full-featured React and TypeScript boilerplate equipped with performant multi-layered parallax scrolling animations.</p>
          <a href="#about" className="btn">Get Started</a>
        </div>
      </div>

      <section id="about" style={{ background: '#0b0f19' }}>
        <div className="section-content">
          <ParallaxLayer speed={-0.03}>
            <h2 style={{ fontSize: '3rem', textAlign: 'center', letterSpacing: '-0.025em' }}>Designed for Depth</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '1rem', maxWidth: '640px', margin: '1rem auto 0' }}>
              Create rich visual hierarchies by decoupling background elements from foreground content with hardware-accelerated transforms.
            </p>
          </ParallaxLayer>

          <div className="grid">
            <ParallaxLayer speed={0.02}>
              <div className="card">
                <h3>High Performance</h3>
                <p>Uses requestAnimationFrame and 3D transforms to bypass paint cycles and ensure continuous 60fps rendering.</p>
              </div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.05}>
              <div className="card">
                <h3>Fully Typed</h3>
                <p>Built with TypeScript interfaces to ensure complete structural safety and smooth integration out of the box.</p>
              </div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.08}>
              <div className="card">
                <h3>Zero Dependencies</h3>
                <p>Lightweight parallax execution natively controlled via standard React hooks without heavy external scripts.</p>
              </div>
            </ParallaxLayer>
          </div>
        </div>
      </section>

      <div className="interlude">
        <div
          className="interlude-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')`,
            transform: `translate3d(0, ${(scrollY - 1200) * 0.2}px, 0)`,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 1rem' }}>
          <h2 style={{ fontSize: '3.5rem', color: '#ffffff', fontWeight: 800 }}>Immersive Visual Flow</h2>
          <p style={{ color: '#cbd5e1', marginTop: '1rem', fontSize: '1.25rem' }}>Enhance storytelling through fluid movement</p>
        </div>
      </div>

      <section id="features" style={{ background: '#0f172a' }}>
        <div className="section-content">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>Core Capabilities</h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '3rem' }}>Everything required to build interactive landing pages.</p>
          
          <div className="grid">
            <div className="card">
              <h3>Custom Parallax Layers</h3>
              <p>Assign independent scroll ratios to individual components to build custom dynamic multi-depth visuals.</p>
            </div>
            <div className="card">
              <h3>Responsive Layouts</h3>
              <p>Fully adapts to any viewport dimensions using flexible CSS grid components and clean scale factors.</p>
            </div>
            <div className="card">
              <h3>Modular Codebase</h3>
              <p>Easily expand, substitute, or componentize sections while retaining full animation functionality.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" style={{ background: '#0b0f19' }}>
        <div className="section-content">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Layer Separation Test</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ParallaxLayer speed={-0.04}>
              <div className="card" style={{ width: '280px', textAlign: 'center' }}>
                <h3>Slow Layer</h3>
                <p style={{ marginTop: '0.5rem' }}>Speed: -0.04</p>
              </div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.01}>
              <div className="card" style={{ width: '280px', textAlign: 'center', borderColor: '#38bdf8' }}>
                <h3>Normal Layer</h3>
                <p style={{ marginTop: '0.5rem' }}>Speed: 0.01</p>
              </div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.06}>
              <div className="card" style={{ width: '280px', textAlign: 'center' }}>
                <h3>Fast Layer</h3>
                <p style={{ marginTop: '0.5rem' }}>Speed: 0.06</p>
              </div>
            </ParallaxLayer>
          </div>
        </div>
      </section>

      <section id="contact" style={{ background: '#0f172a' }}>
        <div className="section-content" style={{ maxWidth: '560px' }}>
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>Contact Us</h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '3rem' }}>
            Get in touch to learn more about implementing advanced React web experiences.
          </p>
          <form onSubmit={handleFormSubmit}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows={5} placeholder="Your Message" required />
            <button type="submit" className="btn" style={{ border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} Parallax Boilerplate Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;