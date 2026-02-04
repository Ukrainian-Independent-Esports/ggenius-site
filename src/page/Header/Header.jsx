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

  const auth = useAuth();
  const { user, login, logout } = auth || {}; // безопасная деструктуризация

  // Получаем Telegram авторизацию из URL
  useEffect(() => {
    if (!auth) return; // проверка внутри эффекта
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

  const changeLang = (key) => {
    return useLangChange(key)
  }

  const loginViaBot = () => {
    const botUsername = 'TestAuthBotb_bot';
    window.location.href = `https://t.me/${botUsername}?start=auth`;
  };

  return (
    <header className={style.header}>
      <div className={menu ? style.containerr : style.container}>
        <nav className={style.nav}>
          <Link to={`/?lang=${lang}`} className={style.navLogoLink}>
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
            <ul className={style.navList}>
              {['Home', 'About', 'Work', 'Our'].map((item, idx) => (
                <li className={style.navListItem} key={idx}>
                  <NavLink
                    to={`/${item === 'Home' ? '' : 'gg'}?lang=${lang}`}
                    end
                    className={({ isActive }) =>
                      isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink
                    }
                  >
                    {changeLang(`navListItemLink${item}`)}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={style.navIns}>
              {user ? (
                <div className={style.navLinkLogin}>
                  <div className={style.navLinkLoginUsers}>
                    <span>{user.nickname}</span>
                    <img className={style.navLinkLoginUsersAvatar} src={user.avatar_permanent_url} alt="" />
                  </div>
                  <ul className={style.navLinkLoginList}>
                    <li className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemLink}>
                        {changeLang('navLinkLoginListItemLink')}
                      </Link>
                    </li>
                    <li onClick={logout} className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemSub}>
                        {changeLang('navLinkLoginListItemSub')}
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <button onClick={loginViaBot} className={style.navLink}>
                    {changeLang('navLink')}
                </button>
              )}

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
            <ul className={style.navList}>
              {['Home', 'About', 'Work', 'Our'].map((item, idx) => (
                <li className={style.navListItem} key={idx}>
                  <NavLink
                    to={`/${item === 'Home' ? '' : 'gg'}?lang=${lang}`}
                    end
                    className={({ isActive }) =>
                      isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink
                    }
                    onClick={() => setMenu(false)}
                  >
                    {changeLang(`navListItemLink${item}`)}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={style.navIns}>
              {user ? (
                <div className={style.navLinkLogin}>
                  <span>{user.nickname}</span>
                  <ul className={style.navLinkLoginList}>
                    <li onClick={logout}>
                      <Link>{changeLang('navLinkLoginListItemSub')}</Link>
                    </li>
                  </ul>
                </div>
              ) : (
                  <button onClick={loginViaBot}>{changeLang('navLink')}</button>
              )}
              <div className={style.navLang}>
                <button
                  className={lang === 'en' ? style.navLangBtnEn : style.navLangBtnEnDis}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </button>
                <button
                  className={lang === 'ua' ? style.navLangBtnua : style.navLangBtnuaDis}
                  onClick={() => changeLanguage('ua')}
                >
                  Українська
                </button>
              </div>
            </div>

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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
