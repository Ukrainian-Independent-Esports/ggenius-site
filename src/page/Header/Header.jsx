import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import style from '../../assets/style/index.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from './img/logo.png';
import useLangChange from '../../Hooks/LangChange';
import yt from '../Footer/img/yt.svg';
import tt from '../Footer/img/tt.svg';
import ds from '../Footer/img/ds.svg';
import { useAuth } from '../../Hooks/useAuth';

const Header = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [lang, setLangState] = useState('ua');
  const [scrollY, setScrollY] = useState('0px')

  const auth = useAuth();
  const { user, login, logout } = auth || {}; // безопасная деструктуризация

  // ✅ вызываем хук один раз
  const t = useLangChange();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(`${window.scrollY}px`);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Получаем Telegram авторизацию из URL
  useEffect(() => {
    if (!auth) return;
    const params = new URLSearchParams(location.search);
    if (params.get('id')) {
      fetch(`https://ggenius-api.onrender.com/bots/auth.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          login(data);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, [location.search, auth, login]);

  // Смена языка при загрузке
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialLang = params.get('lang') || localStorage.getItem('value') || 'ua';
    i18n.changeLanguage(initialLang);
    setLangState(initialLang);
    localStorage.setItem('value', initialLang);
  }, [i18n, location.search]);

  const changeLanguage = (newLang) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('value', newLang);

    const params = new URLSearchParams(location.search);
    params.set('lang', newLang);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };

  const loginViaBot = () => {
    const botUsername = 'ggeniusgg_bot';
    window.location.href = `https://t.me/${botUsername}?auth=auth`;
  }

  return (
    <header className={style.header}>
      <div className={menu ? style.containerr : style.container}>
        <nav className={style.nav}>
          <Link to={`/Home/?lang=${lang}`} className={style.navLogoLink}>
            <img src={logo} alt="Logo" className={style.navLogoLinkImg} />
          </Link>

          <button
            className={menu ? style.menuActive : style.menu}
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            <span className={style.menuSpan1}></span>
            <span className={style.menuSpan2}></span>
            <span className={style.menuSpan3}></span>
          </button>

          {/* DESKTOP MENU */}
          <div className={style.navMenu}>

            {/* Ссылки на страницы Desktop */}
            <ul className={style.navList}>
              {['Home', 'About', 'Work', 'Our', 'Tourn'].map((item, idx) => (
                <li className={style.navListItem} key={idx}>
                  <NavLink
                    to={`/${item}/?lang=${lang}`}
                    end
                    className={({ isActive }) =>
                      isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink
                    }
                  >
                    {t(`navListItemLink${item}`)}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={style.navIns}>
              {/* Авторизация на Desktop */}
              {user ? (
                <div className={style.navLinkLogin}>
                  <div className={style.navLinkLoginUsers}>
                    <span>{user.nickname}</span>
                    <img className={style.navLinkLoginUsersAvatar} src={user.avatar_permanent_url} alt="" />
                  </div>
                  <ul className={style.navLinkLoginList}>
                    <li className={style.navLinkLoginListItem}>
                      <Link to={`profile/?lang=${lang}`} className={style.navLinkLoginListItemLink}>
                        {t('navLinkLoginListItemLink')}
                      </Link>
                    </li>
                    <li onClick={logout} className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemSub}>
                        {t('navLinkLoginListItemSub')}
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <button onClick={loginViaBot} className={style.navLink}>
                  {t('navLink')}
                </button>
              )}

              {/* Смена языка на Desktop */}
              <div className={style.listLangBtn}>
                {lang}
                <ul className={style.listLang}>
                  <li className={style.listLangItem} onClick={() => changeLanguage('ua')}>UA</li>
                  <li className={style.listLangItem} onClick={() => changeLanguage('en')}>EN</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <div className={menu ? style.navMenuActive : style.navMenuDis}>
            <div className={style.navMenuActiveDiv}>
              <div className={style.navMenuActiveLine}>
                <h5 className={style.navMenuLineTitle}>
                  {t('navMenuActiveLine')}
                </h5>
                <span className={style.navMenuActiveLineSpan}></span>
              </div>
              {/* Ссылки на страницы */}
              <ul className={style.navList}>
                {['Home', 'About', 'Work', 'Our', 'Tourn'].map((item, idx) => (
                  <li className={style.navListItem} key={idx} onClick={() => setMenu(!menu)}>
                    <NavLink
                      to={`/${item}/?lang=${lang}`}
                      end
                      className={({ isActive }) =>
                        isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink
                      }
                    >
                      {t(`navListItemLink${item}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className={style.navMenuActiveLine}>
                <h5 className={style.navMenuLineTitle}>
                  {t('navMenuActiveFind')}
                </h5>
                <span className={style.navMenuActiveLineSpan}></span>
              </div>

              {/* Ссылки на соц. сети */}
              <ul className={style.navCopyListMob}>
                <li>
                  <Link to='https://www.youtube.com/@ggenius_ua'>
                    <img src={yt} alt="YouTube" />
                  </Link>
                </li>
                <li>
                  <Link to='https://tiktok.com/@mobile_legends.ua'>
                    <img src={tt} alt="TikTok" />
                  </Link>
                </li>
                <li>
                  <Link to=''>
                    <img src={ds} alt="Discord" />
                  </Link>
                </li>
              </ul>

              <div className={style.navIns}>
                <div className={style.navMenuActiveLine}>
                  <h5 className={style.navMenuLineTitle}>
                    {t('navMenuActiveLang')}
                  </h5>
                  <span className={style.navMenuActiveLineSpan}></span>
                </div>

                {/* Смена языка */}
                <div className={style.navLang}>
                  <button
                    className={lang === 'en' ? style.navLangBtnEn : style.navLangBtnEnDis}
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </button>
                  <button
                    className={lang === 'ua' ? style.navLangBtnUa : style.navLangBtnUaDis}
                    onClick={() => changeLanguage('ua')}
                  >
                    Українська
                  </button>
                </div>

                {/* Авторизация */}
                <div className={style.autho}>
                  {user ? (
                    <div className={style.navLinkLogin}>
                      <NavLink to={`profile/?lang=${lang}`} onClick={() => setMenu(!menu)} className={style.navLinkLoginUsers}>
                        <span>{user.nickname}</span>
                        <img className={style.navLinkLoginUsersAvatar} src={user.avatar_permanent_url} alt="" />
                      </NavLink>
                      <ul className={style.navLinkLoginList}>
                        <li className={style.navLinkLoginListItem} onClick={() => setMenu(!menu)}>
                          <Link to={`profile/?lang=${lang}`} className={style.navLinkLoginListItemLink}>
                            {t('navLinkLoginListItemLink')}
                          </Link>
                        </li>
                        <li onClick={logout} className={style.navLinkLoginListItem}>
                          <Link className={style.navLinkLoginListItemSub}>
                            {t('navLinkLoginListItemSub')}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <button onClick={loginViaBot} className={style.navActiveBtnsLinkInv}>
                      {t('navLink')}
                    </button>
                  )}
                  {/* <Link to={'https://t.me/ggenius_chat'} className={style.navActiveBtnsLink}>
                    {t('navActiveBtnsLink')}
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div >
    </header >
  );
};

export default Header;
