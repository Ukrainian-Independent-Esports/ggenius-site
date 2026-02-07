import style from './assets/style/index.module.css'
import Header from './page/Header/Header';
import Footer from './page/Footer/Footer';
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import LanguageProvider from './Hooks/LanguageProvider';
import { AuthProvider } from './Hooks/useAuth';
import AOS from 'aos';
import "aos/dist/aos.css"

const App = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000, // длительность анимации (мс)
      once: true,     // анимация запускается один раз
    });
  }, []);


  const location = useLocation();
  const [chats, setChats] = useState([])

  useEffect(() => {
    fetch('https://ggenius-api.onrender.com/mlbb/get_posts.php?table=user_memories')
      .then(g => g.json())
      .then(data => setChats(data))
      .catch(err => console.error(err))
  }, [])

  console.log(chats);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (<>
    <AuthProvider>
      <div className={style.wrapper}>
        <Header />
        <main className={style.main}>
          <LanguageProvider />
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  </>
  );
};

export default App;
