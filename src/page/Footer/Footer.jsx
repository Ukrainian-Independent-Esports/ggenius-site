import style from '../../assets/style/index.module.css'
import Marquee from '../../Hooks/Marquee';
import star from '../Home/img/Star.svg'
import logo from '../Header/img/logo.png'
import t from '../../Hooks/LangChange';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import ins from './img/ins.svg'
import yt from './img/yt.svg'
import tt from './img/tt.svg'
import ds from './img/ds.svg'
import useLangChange from '../../Hooks/LangChange';

const Footer = () => {
  const t = useLangChange();

  const value = localStorage.getItem('value')

  return <>

    
    <footer className={style.footer}>

      <div className={style.container}>
        <div className={style.footerInner}>
          <nav className={style.footeNav}>
            <Link to={`/?lang=${value}`} className={style.footerNavLogoLink}>
              <img src={logo} className={style.navLogoLinkImg} alt="Logo" />
            </Link>

            <ul className={style.footerNavList}>
              <li className={style.navListItem}>
                <NavLink to={`/?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink} >
                  {t('navListItemLinkHome')}
                </NavLink>
              </li>
              {/* About */}
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`}
                  end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}>
                  {t('navListItemLinkAbout')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}>
                  {t('navListItemLinkWork')}
                </NavLink>
              </li>
              <li className={style.navListItem}>
                <NavLink to={`/gg?lang=${value}`} end
                  className={({ isActive }) => isActive ? `${style.navListItemLink} ${style.active}` : style.navListItemLink}>
                  {t('navListItemLinkOur')}
                </NavLink>
              </li>
            </ul>
          </nav>

          <ul className={style.footerCopyListMob}>
            <li className={style.footerCopyListItem}>
              <Link className={style.footerCopyListItemLinkIns}>
                <img src={ins} alt="" className={style.footerCopyListItemImg} />
              </Link>
            </li>
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
              <Link className={style.footerCopyListItemLinkDS}>
                <img src={ds} alt="" className={style.footerCopyListItemImg} />
              </Link>
            </li>
          </ul>
          <span className={style.line}></span>

          <p className={style.footerCopySubMob}>Copyright © 2025 GGenius. All rights reserved.</p>


          <div className={style.footerCopy}>
            <p className={style.footerCopySub}>Copyright © 2025 GGenius. All rights reserved.</p>
            <ul className={style.footerCopyList}>
              <li className={style.footerCopyListItem}>
                <Link className={style.footerCopyListItemLinkIns}>
                  <img src={ins} alt="" className={style.footerCopyListItemImg} />
                </Link>
              </li>
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
                <Link className={style.footerCopyListItemLinkDS}>
                  <img src={ds} alt="" className={style.footerCopyListItemImg} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
}

export default Footer;