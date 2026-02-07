import { useState } from 'react';
import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange';
import { useAuth } from '../../Hooks/useAuth';


const Profile = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const [zoom, setZoom] = useState(false)
  const [zoom1, setZoom1] = useState(false)

  const t = useLangChange()
  console.log(user);

  const raw = user.main_roles
  const arr = JSON.parse(raw)

  return <>
    <section className={user !== null ? style.profile : style.profileOff}>
      <div className={style.container}>
        <div className={style.profileInner}>
          <div className={style.profileInnerUserInfo}>
            <div className={style.profileInnerUserInfoAvatarEff}>
              <img src={user.avatar_permanent_url} alt="avatar" className={style.profileInnerUserInfoImg} />
              <span className={style.profileInnerUserInfoAvatarEff1}></span>
            </div>
            <div className={style.profileInnerUserInfoTxt}>
              <h1 className={style.profileInnerUserInfoTitle}>
                {user.nickname}
              </h1>
              <p className={style.profileInnerUserInfoRank}>
                {user.current_rank}
              </p>

              <p className={style.profileInnerUserInfoRank}>
                Основна роль: {arr.map((item, ind) => (
                  <span key={ind}>
                    {item}{ind < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className={style.profileInnerUserInfoRank}>
                Загальна кількість матчів: {user.total_matches}
              </p>
              <p className={style.profileInnerUserInfoRank}>
                Загальни він рейт: {user.win_rate}%

              </p>
            </div>
          </div>
          <div className={style.profileInnerUserChara}>
            <h2 className={style.profileInnerUserCharaTitle}>
              Ігровий профіль
            </h2>
            <div className={style.profileInnerUserCharaImages}>
              <img src={user.basic_profile_permanent_url} alt="photo game profile" className={!zoom ? style.profileInnerUserCharaImg : style.profileInnerUserCharaImgZoom} onClick={() => setZoom(!zoom)} />
              <img src={user.heroes_photo_permanent_url} alt="photo game hero" className={!zoom1 ? style.profileInnerUserCharaImg1 : style.profileInnerUserCharaImgZoom1} onClick={() => setZoom1(!zoom1)} />
            </div>
            <h2 className={style.profileInnerUserCharaTitleHero}>Улюблені герої</h2>
            <ul className={style.profileInnerUserCharaList}>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero1_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно матчів на герої: {user.hero1_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Win rate: {user.hero1_win_rate}%
                </p>
              </li>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero2_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно матчів на герої: {user.hero2_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Win rate: {user.hero2_win_rate}%
                </p>
              </li>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero3_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно матчів на герої: {user.hero3_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Win rate: {user.hero3_win_rate}%
                </p>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </section>
  </>
}

export default Profile;