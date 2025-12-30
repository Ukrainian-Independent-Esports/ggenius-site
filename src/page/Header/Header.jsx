import { Link, useNavigate, useParams, useLocation, NavLink } from 'react-router-dom';
import style from '../../assets/style/index.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from './img/logo.png'
import useLangChange from '../../Hooks/LangChange';

import ins from '../Footer/img/ins.svg'
import yt from '../Footer/img/yt.svg'
import tt from '../Footer/img/tt.svg'
import ds from '../Footer/img/ds.svg'


const Header = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false)
  const { lang } = useParams();



  const botUsername = 'TestAuthBotb_bot';
  const loginUrl = `https://t.me/${botUsername}?start=auth`;

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tg_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const userDataBase64 = params.get('user');

    if (userDataBase64) {
      try {

        const decodedData = JSON.parse(atob(userDataBase64));
        console.log('decodedData:', decodedData);


        setUser(decodedData);
        localStorage.setItem('tg_user', JSON.stringify(decodedData));


        window.history.replaceState({}, document.title, "/");
      } catch (e) {
        console.error("Ошибка при разборе данных пользователя", e);
      }
    }
  }, []);

  const loginViaBot = () => {
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('tg_user');
    setUser(null);
  };


  const setLang = (lang) => {
    return useLangChange(lang)
  }



  const [value, setValue] = useState(() => {
    if (lang) return lang;
    const saved = localStorage.getItem('value');
    return saved || 'uk';
  });

  useEffect(() => {
    const supportedLangs = ['uk', 'en'];
    const currentLang = supportedLangs.includes(lang) ? lang : 'uk';

    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }

    setValue(currentLang);
    localStorage.setItem('value', currentLang);
  }, [lang, i18n]);

  const changeLanguage = (newLang) => {
    setValue(newLang);
    localStorage.setItem('value', newLang);

    const pathParts = location.pathname.split('/').filter(Boolean);

    if (pathParts.length > 0 && ['uk', 'en'].includes(pathParts[0])) {
      pathParts[0] = newLang;
    } else {
      pathParts.unshift(newLang);
    }

    navigate(`/${pathParts.join('/')}`);
  };



  return (
    <header className={style.header}>
      <div className={menu ? style.containerr : style.container}>
        <nav className={style.nav}>
          <Link to={`/${value}`} className={style.navLogoLink}>
            <img src={logo} className={style.navLogoLinkImg} alt="Logo" />
          </Link>

          <button className={menu ? style.menuActive : style.menu} onClick={() => setMenu(!menu)} aria-label="Toggle menu">
            <span className={style.menuSpan1}></span>
            <span className={style.menuSpan2}></span>
            <span className={style.menuSpan3}></span>
          </button>


          {/* DESKTOP */}
          <div className={style.navMenu}>
            <ul className={style.navList}>
              <li className={style.navListItem}>
                <NavLink to={`/${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkHome')}
                </NavLink>
              </li>
              {/* About */}
              <li className={style.navListItem}>
                <NavLink to={`/${value}/Gg`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkAbout')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/${value}/gg`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkWork')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/${value}/gg`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkOur')}

                </NavLink>
              </li>
            </ul>

            <div className={style.navIns}>
              {
                user ? (
                  <Link className={style.navLinkLogin}>
                    <span>{user.first_name}</span>
                    {/* <ul className={style.navLinkLoginList}>
                    <li className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemLink}>
                        {setLang('navLinkLoginListItemLink')}
                      </Link>
                    </li>
                    <li onClick={handleLogout} className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemSub}>
                        {setLang('navLinkLoginListItemSub')}
                      </Link>
                    </li>
                  </ul> */}
                  </Link>
                ) : (
                  <Link onClick={loginViaBot} className={style.navLink}>
                    {setLang('navLink')}
                  </Link>
                )
              }

              <select
                value={value}
                className={style.listLang}
                onChange={e => changeLanguage(e.target.value)}
              >
                <option value='uk'>UK</option>
                <option value='en'>EN</option>
              </select>
            </div>
          </div>


          {/* MOBILE */}
          <div className={menu ? style.navMenuActive : style.navMenuDis}>
            <div className={style.navMenuActiveLine}>
              {useLangChange('navMenuActiveLine')}
              <span className={style.navMenuActiveLineSpan}></span>
            </div>
            <ul className={style.navList}>
              <li className={style.navListItem}>
                <NavLink to={`/${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkHome')}
                </NavLink>
              </li>
              {/* About */}
              <li className={style.navListItem}>
                <NavLink to={`/${value}/gg`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkAbout')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/${value}/gg`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkWork')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/${value}/gg`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkOur')}

                </NavLink>
              </li>
            </ul>
            <div className={style.navMenuActiveLine}>
              {useLangChange('navMenuActiveFind')}
              <span className={style.navMenuActiveLineSpan}></span>
              <ul className={style.navCopyListMob}>
                {/* <li className={style.footerCopyListItem}>
                <Link to='' className={style.footerCopyListItemLinkIns}>
                  <img src={ins} alt="" className={style.footerCopyListItemImg} />
                </Link>
              </li> */}
                <li className={style.footerCopyListItem}>
                  <Link to='https://www.youtube.com/@ggenius_ua' className={style.footerCopyListItemLinkYT}>
                    <img src={yt} alt="" className={style.footerCopyListItemImg} />
                  </Link>
                </li>
                <li className={style.footerCopyListItem}>
                  <Link to='https://tiktok.com/@mobile_legends.ua' className={style.footerCopyListItemLinkTT}>
                    <img src={tt} alt="" className={style.footerCopyListItemImg} />
                  </Link>
                </li>
                <li className={style.footerCopyListItem}>
                  <Link to='' className={style.footerCopyListItemLinkDS}>
                    <img src={ds} alt="" className={style.footerCopyListItemImg} />
                  </Link>
                </li>
              </ul>
            </div>
            <div className={style.navIns}>
              <div className={style.navIns2}>{
                user ? (
                  <Link className={style.navLinkLogin}>
                    <span>{user.first_name}</span>
                    {/* <ul className={style.navLinkLoginList}>
                    <li className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemLink}>
                        {setLang('navLinkLoginListItemLink')}
                      </Link>
                    </li>
                    <li onClick={handleLogout} className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemSub}>
                        {setLang('navLinkLoginListItemSub')}
                      </Link>
                    </li>
                  </ul> */}
                  </Link>
                ) : (
                  <Link onClick={loginViaBot} className={style.navLink}>
                    {setLang('navLink')}
                  </Link>
                )
              }
              </div>
              <div className={style.navMenuActiveLine}>
                {useLangChange('navMenuActiveLang')}
                <span className={style.navMenuActiveLineSpan}></span>
              </div>
              <div className={style.navLang}
              >
                <button onClick={() => changeLanguage('en')}
                  value='en'
                  className={value == 'en' ? style.navLangBtnEn : style.navLangBtnEnDis}>English</button>
                <button
                  value='uk' onClick={() => changeLanguage('uk')} className={value == 'uk' ? style.navLangBtnUk : style.navLangBtnUkDis}>Українська</button>

              </div>
              <select
                value={value}
                className={style.listLang}
                onChange={e => changeLanguage(e.target.value)}
                disabled
              >
                <option value='uk'>UK</option>
                <option value='en'>EN</option>
              </select>

              <div className={style.navActiveBtns}>
                <Link to='https://t.me/ggenius_chat' className={style.navActiveBtnsLinkInv}>
                  {useLangChange('navLink')}
                </Link>
                <Link className={style.navActiveBtnsLink}>
                  {useLangChange('navActiveBtnsLink')}
                </Link>

              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
