import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import style from '../../assets/style/index.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from './img/logo.png'
import useLangChange from '../../Hooks/LangChange';

// import ins from '../Footer/img/ins.svg'
import yt from '../Footer/img/yt.svg'
import tt from '../Footer/img/tt.svg'
import ds from '../Footer/img/ds.svg'
import { useAuth } from '../../Hooks/useAuth';



const Header = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false)
  const [value, setValue] = useState('ua');
  if (!auth) return null; // защита

  const { users, login, logout } = auth;
  const auth = useAuth();
  console.log('AUTH:', auth);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('id')) {
      fetch(`https://ggenius-api.onrender.com/bots/auth.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          login(data); // 🔥 ВАЖНО
          window.history.replaceState({}, document.title, "/");
        });
    }
  }, []);
  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lang = params.get('lang') || localStorage.getItem('value') || 'ua';
    i18n.changeLanguage(lang);
    setValue(lang);
  }, []);

  

 

  // // После редиректа с ?id=123&hash=...
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   if (params.get('id')) {
  //     fetch(`https://ggenius-api.onrender.com/bots/auth.php?${params.toString()}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         setUser(data.user)
  //         localStorage.setItem('tg_user', JSON.stringify(data.user));
  //         localStorage.setItem('jwt', data.jwt);
  //         localStorage.setItem('refresh_token', data.refresh_token);
  //         // чистим URL
  //         window.history.replaceState({}, document.title, "/");
  //       });
  //   }
  // }, []);


  // const loginViaBot = () => {
  //   window.location.href = loginUrl;
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('tg_user');
  //   setUser(null);
  // };


  const setLang = (lang) => {
    return useLangChange(lang)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langFromUrl = params.get('lang');
    const savedLang = localStorage.getItem('value');
    const lang = langFromUrl || savedLang || 'ua';

    setValue(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('value', lang);
  }, [location.search]);

  const changeLanguage = (newLang) => {
    setValue(newLang);
    localStorage.setItem('value', newLang);

    const params = new URLSearchParams(location.search);
    params.set('lang', newLang);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };



  // console.log(users);

  

  return (
    <header className={style.header}>
      <div className={menu ? style.containerr : style.container}>
        <nav className={style.nav}>
          <Link to={`/?lang=${value}`} className={style.navLogoLink}>
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
                <NavLink to={`/?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkHome')}
                </NavLink>
              </li>
              {/* About */}
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkAbout')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkWork')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                >
                  {useLangChange('navListItemLinkOur')}

                </NavLink>
              </li>
            </ul>

            <div className={style.navIns}>
              {
                users ? (
                  <Link className={style.navLinkLogin}>
                    {/* <img
                      src={users.photo_url}
                      referrerPolicy="no-referrer"
                      alt=""
                    /> */}
                    <span>{users.nickname}</span>
                    <ul className={style.navLinkLoginList}>
                    <li className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemLink}>
                        {setLang('navLinkLoginListItemLink')}
                      </Link>
                    </li>
                    <li onClick={logout} className={style.navLinkLoginListItem}>
                      <Link className={style.navLinkLoginListItemSub}>
                        {setLang('navLinkLoginListItemSub')}
                      </Link>
                    </li>
                  </ul>
                  </Link>
                ) : (
                  <Link onClick={login} className={style.navLink}>
                    {setLang('navLink')}
                  </Link>
                )
              }

              
              <button className={style.listLangBtn}>
              {value}
                <ul className={style.listLang}>
                  <li className={style.listLangOpt} onClick={()=> changeLanguage('ua')}>ua</li>
                  <li className={style.listLangOpt} onClick={() => changeLanguage('en')}>EN</li>
                </ul>
              </button>
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
                <NavLink to={`/?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkHome')}
                </NavLink>
              </li>
              {/* About */}
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkAbout')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}
                  onClick={() => setMenu(!menu)}>
                  {useLangChange('navListItemLinkWork')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
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
                  value='ua' onClick={() => changeLanguage('ua')} className={value == 'ua' ? style.navLangBtnua : style.navLangBtnuaDis}>Українська</button>

              </div>
              <select
                value={value}
                className={style.listLang}
                onChange={e => changeLanguage(e.target.value)}
                disabled
              >
                <option value='ua'>UA</option>
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
