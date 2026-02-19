import { isRouteErrorResponse, useRouteError } from 'react-router';
import style from '../../assets/style/index.module.css'

import back from './img/back.webp'
import backMob from './img/backMob.webp'

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import useLangChange from '../../Hooks/LangChange';
import { NavLink } from 'react-router-dom';



const Error = () => {
  const value = localStorage.getItem('value')
  const error = useRouteError()
  const status = 404;
  const t = useLangChange()
  console.error(error);

  return <>
    <section className={style.errorPage}>
      <div className={style.errorPageInner}>
        <img className={style.errorPageInnerBack} src={back} alt="back" />
        <img className={style.errorPageInnerBackMob} src={backMob} alt="back" />

        <div className={style.errorPageInnerCont}>
          <h5 className={style.errorPageInnerContTitle}>
            <span>{status} </span>

            {t('Not Found')}
            <p>{error}</p>
          </h5>
          <p className={style.errorPageInnerContSub}>
            {t('errorPageInnerContSub')}
          </p>
          <NavLink className={style.errorPageInnerContLink} to={`/Home/?lang=${value}`}
            end>
            {t('errorPageInnerContLink')}
          </NavLink>
        </div>
      </div>
    </section>
  </>
}

export default Error;