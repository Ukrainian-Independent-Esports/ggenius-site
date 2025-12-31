import style from './assets/style/index.module.css'
import Header from './page/Header/Header';
import Footer from './page/Footer/Footer';
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import LanguageProvider from './Hooks/LanguageProvider';



const App = () => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;

    const flakes = [];
    const FLAKES_COUNT = 150;

    function resize() {
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;

      canvas.width = width * DPR;
      canvas.height = height * DPR;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    }

    function createFlakes() {
      flakes.length = 0;
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;

      for (let i = 0; i < FLAKES_COUNT; i++) {
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.5 + 1.5,
          s: Math.random() * 1.2 + 0.4,
        });
      }
    }

    function draw() {
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();

      flakes.forEach(f => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      });

      ctx.fill();
    }

    function update() {
      const height = wrapper.offsetHeight;
      const width = wrapper.offsetWidth;

      flakes.forEach(f => {
        f.y += f.s;

        if (f.y - f.r > height) {
          f.y = -Math.random() * 50;
          f.x = Math.random() * width;
        }
      });
    }

    let rafId;
    function loop() {
      draw();
      update();
      rafId = requestAnimationFrame(loop);
    }

    resize();
    createFlakes();
    loop();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // можно убрать, если не нужно
    });
  }, [location]);

 

  return (<>

    <div ref={wrapperRef} className={style.wrapper}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          zIndex: 1,
        }}
      />

      <Header />
      <main className={style.main}>
        <LanguageProvider />

        <Outlet />
      </main>
      <Footer />
    </div>
  </>
  );
};

export default App;
