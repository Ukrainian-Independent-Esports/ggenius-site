import { useEffect, useState } from 'react';
import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange';
import { NavLink } from 'react-router-dom';

const Tournaments = () => {
  const t = useLangChange()
  const [tourn, setTourn] = useState([])

  useEffect(() => {
    fetch('https://ggenius-api.onrender.com/mlbb/get_posts.php?table=tournaments')
      .then(g => g.json())
      .then(data => setTourn(data))
      .catch(err => console.error(err))
  }, [])

  // console.log(tourn);

  return <>
    <section className={style.tournaments}>
      <div className={style.container}>
        <div className={style.tournamentsInner}>
          <h1 className={style.tournamentsInnerTitle}>
            {t('tournamentsInnerTitle')}
          </h1>
          <ul className={style.tournamentsInnerList}>
            {tourn.map(item => (
              <li className={style.tournamentsInnerListItem} key={item.id}>
                <NavLink className={style.tournamentsInnerListItemLink}>
                  <div className={style.tournamentsInnerListItemInfo}>
                    <h2 className={style.tournamentsInnerListItemTitle}>
                      {t('tournamentsInnerListItemTitle')}: {item.name}
                    </h2>
                    <p className={style.tournamentsInnerListItemInfoPrize}>
                      {t('tournamentsInnerListItemInfoPrize')}: {item.prize_fund}
                    </p>
                  </div>
                  <p className={style.tournamentsInnerListItemDesc}>
                    {t('tournamentsInnerListItemDesc')}: {item.description}
                  </p>
                  <p className={style.tournamentsInnerListItemStatus}>
                    {t('tournamentsInnerListItemStatus')}: <span className={item.status === 'FINISHED' ? style.tournamentsInnerListItemStatusStat : style.tournamentsInnerListItemStatusStatActive}>
                      {item.status === 'FINISHED' ? 'Завершений' : 'Триває'}
                    </span>
                  </p>
                </NavLink>
              </li>

            ))}
          </ul>
        </div>
      </div>
    </section>
  </>
}

export default Tournaments;