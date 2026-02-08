import { useState } from 'react';
import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange';
import { useAuth } from '../../Hooks/useAuth';


import userBack from './img/userBackground.png'
import iconId from './img/icon-id.svg'
import iconRole from './img/icon-role.svg'
import iconLocation from './img/icon-location.svg'

const Profile = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const [nav, setNav] = useState(1)
  const t = useLangChange()
  console.log(user);
  console.log(nav);


  const raw = user.main_roles
  const arr = JSON.parse(raw)



  return <>
    <section className={user !== null ? style.profile : style.profileOff}>
      <div className={style.container}>
        <div className={style.profileInner}>
          <div className={style.profileInnerUserInfo}>
            <div className={style.profileInnerUserInfoObv}>
              <img className={style.profileInnerUserInfoBack} src={userBack} alt="" />
              <div className={style.profileInnerUserInfoAvatarEff}>
                <img src={user.avatar_permanent_url !== null ? user.avatar_permanent_url : ''} alt={user.avatar_permanent_url !== null ? 'avatar' : ''} className={style.profileInnerUserInfoImg} />
                <span className={style.profileInnerUserInfoAvatarEff1}></span>
              </div>
              <div className={style.profileInnerUserInfoTxt}>
                <h1 className={style.profileInnerUserInfoTitle}>
                  {user.nickname}
                </h1>
                <p className={style.profileInnerUserInfoRank}>
                  <img src={iconId} alt="" /> {t('profileInnerUserInfoRankId')} {user.player_id}({user.server_id})
                </p>
                <p className={style.profileInnerUserInfoRank}>
                  <img src={iconRole} alt="" /> {t('profileInnerUserInfoRankRole')} {arr !== null ? arr.map((item, ind) => (
                    <span key={ind}>
                      {item}{ind < arr.length - 1 ? ', ' : ''}
                    </span>
                  )) : 'Завантажте скрин з гри у бота'}
                </p>
                <p className={style.profileInnerUserInfoRank}>
                  <img src={iconLocation} alt="icon location" /> {t('profileInnerUserInfoRankLocation')} {user.location !== null ? user.location : 'Завантажте скрин з гри у бота'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={style.profileInnerHeader}>
          <ul className={style.profileInnerHeaderList}>
            <li className={nav == 1 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(1)}>{t('profileInnerHeaderListItemTotal')}</li>
            <li className={nav == 2 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(2)}>{t('profileInnerHeaderListItemDetail')}</li>
            <li className={nav == 3 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(3)}>{t('profileInnerHeaderListItemSettings')}</li>
          </ul>
                  
          <div className={style.profileInnerHeaderInfo}>
            <div className={style.profileInnerHeaderInfoNav}>
                  {nav}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}

export default Profile;