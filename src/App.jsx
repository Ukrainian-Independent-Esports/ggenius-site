import style from './assets/style/index.module.css'
import Header from './page/Header/Header';
import Footer from './page/Footer/Footer';
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import LanguageProvider from './Hooks/LanguageProvider';



const App = () => {
  const location = useLocation();
  const [chats, setChats] = useState([])
 
  useEffect(() => {
    fetch('https://ggenius-api.onrender.com/mlbb/get_posts.php?table=users')
      .then(g => g.json())
      .then(data => setChats(data))
      .catch(err => console.error(err))
  }, [])
 

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (<>
    <div  className={style.wrapper}>
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
