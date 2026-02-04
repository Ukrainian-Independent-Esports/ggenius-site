import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange';
import { useAuth } from '../../Hooks/useAuth';


const Profile = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const t = useLangChange()
  console.log(user);

 
  const raw = user.main_roles
  const arr = JSON.parse(raw)


  return <>
    <section className={style.profile}>
      <div className={style.container}>
        <div className={style.profileInner}>
          <div className={style.profileInnerUserInfo}>
            <img src={user.avatar_permanent_url} alt="avatar" className={style.profileInnerUserInfoImg} />
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
          </div>
          <div className={style.profileInnerUserChara}>
            <h2 className={style.profileInnerUserCharaTitle}>
              Ігровий профіль
            </h2>
            <img src={user.basic_profile_permanent_url} alt="" className={style.profileInnerUserCharaImg} />
            <h2 className={style.profileInnerUserCharaTitleHero}>Улюблені герої</h2>
            <ul className={style.profileInnerUserCharaList}>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero1_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно на герої: {user.hero1_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  він райте: {user.hero1_win_rate}%
                </p>
              </li>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero2_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно на герої: {user.hero2_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  він райте: {user.hero2_win_rate}%
                </p>
              </li>
              <li className={style.profileInnerUserCharaListItem}>
                <h2 className={style.profileInnerUserCharaListItemTitle}>
                  {user.hero3_name}
                </h2>
                <p className={style.profileInnerUserCharaListItemSub}>
                  Зіграно на герої: {user.hero3_matches}
                </p>
                <p className={style.profileInnerUserCharaListItemSub}>
                  він райте: {user.hero3_win_rate}%
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