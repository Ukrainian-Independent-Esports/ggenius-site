import { useState } from 'react';
import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange';
import { useAuth } from '../../Hooks/useAuth';


import userBack from './img/userBackground.png'
import iconId from './img/icon-id.svg'
import iconRole from './img/icon-role.svg'
import iconLocation from './img/icon-location.svg'
import iconInfo from './img/icon-info.svg'

const Profile = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const [nav, setNav] = useState(1)
  const [btn, setBtn] = useState(3)
  const t = useLangChange()
  console.log(user);

  const procent = (value) => {
    const percent = (value / 10000) * 100
    return percent.toFixed(2)
  }

  const procentMax = (value) => {
    const percent = (value / 20000) * 100
    return percent.toFixed(2)
  }

  const raw = user.main_roles
  const arr = JSON.parse(raw)



  return <>
    <section className={user !== null ? style.profile : style.profileOff}>
      <div className={style.container}>
        <div className={style.profileInner}>
          <div className={style.profileInnerUserInfo} data-aos="fade-down">
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



          <div className={style.profileInnerHeader} >
            <ul className={style.profileInnerHeaderList} data-aos="fade-right">
              <li className={nav == 1 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(1)}>{t('profileInnerHeaderListItemTotal')}</li>
              <li className={nav == 2 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(2)}>{t('profileInnerHeaderListItemDetail')}</li>
              <li className={nav == 3 ? style.profileInnerHeaderListItem : style.profileInnerHeaderListItemOff} onClick={() => setNav(3)}>{t('profileInnerHeaderListItemSettings')}</li>
            </ul>

            <div className={style.profileInnerHeaderGroups} data-aos="fade-down">
              {/* ЗАГАЛЬНА ІНФОРМАЦІЯ */}
              <div className={nav === 1 ? style.profileInnerHeaderInfo : style.profileInnerHeaderInfoDis} >
                <div className={style.profileInnerHeaderInfo1Nav}>
                  <h3 className={style.profileInnerHeaderInfo1NavTitle}>
                    {t('profileInnerHeaderInfoNavTitle')}
                  </h3>

                  <ul className={style.profileInnerHeaderInfo1NavList}>
                    <li className={style.profileInnerHeaderInfo1NavListItem}>
                      <button className={btn === 1 ? style.profileInnerHeaderInfo1NavListItemBtnActive : style.profileInnerHeaderInfo1NavListItemBtn}
                        onClick={() => setBtn(1)}>
                        {t('profileInnerHeaderInfoNavListItemBtn30Days')}
                      </button>
                    </li>
                    <li className={style.profileInnerHeaderInfo1NavListItem}>
                      <button className={btn === 2 ? style.profileInnerHeaderInfo1NavListItemBtnActive : style.profileInnerHeaderInfo1NavListItemBtn}
                        onClick={() => setBtn(2)}>
                        {t('profileInnerHeaderInfoNavListItemBtnSeason')}
                      </button>
                    </li>
                    <li className={style.profileInnerHeaderInfo1NavListItem}>
                      <button className={btn === 3 ? style.profileInnerHeaderInfo1NavListItemBtnActive : style.profileInnerHeaderInfo1NavListItemBtn}
                        onClick={() => setBtn(3)}>
                        {t('profileInnerHeaderInfoNavListItemBtnTotal')}
                      </button>
                    </li>
                  </ul>
                </div>

                {/* ЗА ВЕСЬ ЧАС */}
                <div className={style.profileInnerHeaderInfo1Total}>
                  <div className={style.profileInnerHeaderInfo1TotalStat}>

                    <div className={style.profileInnerHeaderInfo1TotalStatGroup} >

                      {/* ЗАГАЛЬНІ ЗНАЧЕННЯ */}
                      <div className={style.profileInnerHeaderInfo1TotalStatGroup1} data-aos="flip-left">
                        <div className={style.profileInnerHeaderInfo1TotalStatGroup1TotalMeaning}>
                          <h4 className={style.profileInnerHeaderInfo1TotalStatTitle}>
                            {t('profileInnerHeaderInfo1TotalStatTitle')}
                          </h4>
                          <ul className={style.profileInnerHeaderInfo1TotalStatList}>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItem}>
                              <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImg} />
                              <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                {t('profileInnerHeaderInfo1TotalStatListItemTitleTotalMatches')}
                              </h4>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSub}>
                                {user.total_matches}
                              </p>
                            </li>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItem}>
                              <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImg} />
                              <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                {t('profileInnerHeaderInfo1TotalStatListItemTitleMaksMinRank')}
                              </h4>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSub}>
                                {user.current_rank}
                              </p>
                            </li>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItem}>
                              <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImg} />
                              <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                {t('profileInnerHeaderInfo1TotalStatListItemTitleMaksMaksRank')}
                              </h4>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSub}>
                                {user.highest_rank}

                              </p>
                            </li>
                          </ul>
                        </div>

                        {/* ДЕТАЛІ */}
                        <div className={style.profileInnerHeaderInfo1TotalStatGroup1Detail}>
                          <h4 className={style.profileInnerHeaderInfo1TotalStatGroup1DetailTitle}>
                            {t('profileInnerHeaderInfo1TotalStatGroup1DetailTitle')}
                          </h4>
                          <ul className={style.profileInnerHeaderInfo1TotalStatListDet}>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItemDet}>
                              <div className={style.profileInnerHeaderInfo1TotalStatListItemHed}>
                                <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImgDet} />
                                <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                  {t('profileInnerHeaderInfo1TotalStatListItemTitleKDA')}
                                </h4>
                              </div>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSubDet}>
                                {user.kda_ratio}
                              </p>
                            </li>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItemDet}>
                              <div className={style.profileInnerHeaderInfo1TotalStatListItemHed}>
                                <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImgDet} />
                                <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                  {t('profileInnerHeaderInfo1TotalStatListItemTitleDead')}
                                </h4>
                              </div>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSubDet}>
                                {user.avg_deaths_per_match}
                              </p>
                            </li>
                            <li className={style.profileInnerHeaderInfo1TotalStatListItemDet}>
                              <div className={style.profileInnerHeaderInfo1TotalStatListItemHed}>
                                <img src={iconInfo} alt="" className={style.profileInnerHeaderInfo1TotalStatListItemImgDet} />
                                <h4 className={style.profileInnerHeaderInfo1TotalStatListItemTitle}>
                                  {t('profileInnerHeaderInfo1TotalStatListItemTitleHelp')}
                                </h4>
                              </div>
                              <p className={style.profileInnerHeaderInfo1TotalStatListItemSubDet}>
                                {user.most_assists_in_one_game}
                              </p>
                            </li>
                          </ul>
                        </div>

                        {/* Економіка та шкода ( урон)  */}
                        <div className={style.profileInnerEconomy}>
                          <h5 className={style.profileInnerEconomyTitle}>
                            {t('profileInnerEconomyTitle')}
                          </h5>

                          <ul className={style.profileInnerEconomyList}>
                            {/* GOLD */}
                            <li className={style.profileInnerEconomyListItem}>
                              <div className={style.profileInnerEconomyListItemHeads}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerEconomyListItemHeadsImg} />
                                <h5 className={style.profileInnerEconomyListItemHeadsTitle}>
                                  {t('profileInnerEconomyListItemHeadsTitleGold')}
                                </h5>
                              </div>
                              <div className={style.profileInnerEconomyListItemBack}>
                                <div className={style.profileInnerEconomyListItemBackStroke} style={{ '--value': procent(user.avg_gold_per_min) }}>
                                  <span className={style.profileInnerEconomyListItemBackStrokeInfo}>
                                    {procent(user.avg_gold_per_min)}%
                                  </span>
                                </div>
                              </div>
                              <p className={style.profileInnerEconomyListItemSubGold}>
                                {user.avg_gold_per_min}
                              </p>
                            </li>
                            {/* DAMEG */}
                            <li className={style.profileInnerEconomyListItem}>
                              <div className={style.profileInnerEconomyListItemHeads}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerEconomyListItemHeadsImg} />
                                <h5 className={style.profileInnerEconomyListItemHeadsTitle}>
                                  {t('profileInnerEconomyListItemHeadsTitleDmg')}
                                </h5>
                              </div>
                              <div className={style.profileInnerEconomyListItemBack}>
                                <div className={style.profileInnerEconomyListItemBackStroke} style={{ '--value': procent(user.avg_hero_dmg_per_min) }}>
                                  <span className={style.profileInnerEconomyListItemBackStrokeInfo}>
                                    {procent(user.avg_hero_dmg_per_min)}%
                                  </span>

                                </div>
                              </div>
                              <p className={style.profileInnerEconomyListItemSubDMG}>
                                {user.avg_hero_dmg_per_min}
                              </p>
                            </li>
                            {/* turret DMG */}
                            <li className={style.profileInnerEconomyListItem}>
                              <div className={style.profileInnerEconomyListItemHeads}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerEconomyListItemHeadsImg} />
                                <h5 className={style.profileInnerEconomyListItemHeadsTitle}>
                                  {t('profileInnerEconomyListItemHeadsTitleCurDmg')}
                                </h5>
                              </div>
                              <div className={style.profileInnerEconomyListItemBack} >
                                <div className={style.profileInnerEconomyListItemBackStroke} style={{ '--value': procent(user.avg_turret_dmg_per_match) }}>
                                  <span className={style.profileInnerEconomyListItemBackStrokeInfo}>
                                    {
                                      procent(user.avg_turret_dmg_per_match)
                                    }%
                                  </span>
                                </div>
                              </div>
                              <p className={style.profileInnerEconomyListItemSubTurDMG}>
                                {user.avg_turret_dmg_per_match}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* СЕРЕДНЯ ЗА МАТЧ СТАТИСТИКА */}
                      <div className={style.profileInnerTotalMatches} data-aos="fade-left">
                        {/* СРЕДНЕЕ */}
                        <div className={style.profileInnerTotalMatchesАverage}>
                          <h5 className={style.profileInnerTotalMatchesАverageTitle}>
                            {t('profileInnerTotalMatchesАverageTitle')}
                          </h5>

                          <ul className={style.profileInnerTotalMatchesАverageList}>
                            <li className={style.profileInnerTotalMatchesАverageListItem}>
                              <div className={style.profileInnerTotalMatchesАverageListItemHed}>
                                <span className={style.profileInnerTotalMatchesАverageListItemHed}>
                                  <img src={iconInfo} className={style.profileInnerTotalMatchesАverageListItemHedImg} alt="" />
                                  <h5 className={style.profileInnerTotalMatchesАverageListItemHeadTitle}>
                                    {t('profileInnerTotalMatchesАverageListItemHeadTitleGold')}
                                  </h5>
                                </span>
                                <p className={style.profileInnerTotalMatchesАverageListItemHedSub}>
                                  {user.highest_gold_per_min}
                                </p>
                              </div>

                              <div className={style.profileInnerTotalMatchesАverageListItemBack} style={{ '--valueMax': procentMax(user.highest_gold_per_min) }}>
                                <span></span>
                              </div>
                            </li>
                            <li className={style.profileInnerTotalMatchesАverageListItem}>
                              <div className={style.profileInnerTotalMatchesАverageListItemHed}>
                                <span className={style.profileInnerTotalMatchesАverageListItemHed}>
                                  <img src={iconInfo} className={style.profileInnerTotalMatchesАverageListItemHedImg} alt="icon" />
                                  <h5 className={style.profileInnerTotalMatchesАverageListItemHeadTitle}>
                                    {t('profileInnerTotalMatchesАverageListItemHeadTitleDMG')}
                                  </h5>
                                </span>
                                <p className={style.profileInnerTotalMatchesАverageListItemHedSub}>
                                  {user.highest_dmg_per_min}
                                </p>
                              </div>
                              <div className={style.profileInnerTotalMatchesАverageListItemBack} style={{ '--valueMax': procentMax(user.highest_dmg_per_min) }}>
                                <span></span>
                              </div>
                            </li>
                            <li className={style.profileInnerTotalMatchesАverageListItem}>
                              <div className={style.profileInnerTotalMatchesАverageListItemHed}>
                                <span className={style.profileInnerTotalMatchesАverageListItemHed}>

                                  <img src={iconInfo} className={style.profileInnerTotalMatchesАverageListItemHedImg} alt="icon" />
                                  <h5 className={style.profileInnerTotalMatchesАverageListItemHeadTitle}>
                                    {t('profileInnerTotalMatchesАverageListItemHeadTitleTurDMG')}
                                  </h5>
                                </span>
                                <p className={style.profileInnerTotalMatchesАverageListItemHedSub}>
                                  {user.highest_dmg_taken_per_min}
                                </p>
                              </div>
                              <div className={style.profileInnerTotalMatchesАverageListItemBack} style={{ '--valueMax': procentMax(user.highest_dmg_taken_per_min) }}>
                                <span></span>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className={style.profileInnerTotalMatchesAchievement}>
                          <h5 className={style.profileInnerTotalMatchesAchievementTitle}>
                            {t('profileInnerTotalMatchesAchievementTitle')}
                          </h5>

                          <ul className={style.profileInnerTotalMatchesAchievementList}>
                            <li className={style.profileInnerTotalMatchesAchievementListItem}>
                              <div className={style.profileInnerTotalMatchesAchievementListItemHead}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerTotalMatchesAchievementListItemHeadImg} />
                                <h6 className={style.profileInnerTotalMatchesAchievementListItemHeadTitle}>
                                  {t('profileInnerTotalMatchesAchievementListItemHeadTitleFirst')}
                                </h6>
                              </div>
                              <p className={style.profileInnerTotalMatchesAchievementListItemSub}>
                                x {user.first_blood_count}
                              </p>
                            </li>
                            <li className={style.profileInnerTotalMatchesAchievementListItem}>
                              <div className={style.profileInnerTotalMatchesAchievementListItemHead}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerTotalMatchesAchievementListItemHeadImg} />
                                <h6 className={style.profileInnerTotalMatchesAchievementListItemHeadTitle}>
                                  {t('profileInnerTotalMatchesAchievementListItemHeadTitleDubl')}
                                </h6>
                              </div>
                              <p className={style.profileInnerTotalMatchesAchievementListItemSub}>
                                x {user.double_kill_count}
                              </p>
                            </li>
                            <li className={style.profileInnerTotalMatchesAchievementListItem}>
                              <div className={style.profileInnerTotalMatchesAchievementListItemHead}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerTotalMatchesAchievementListItemHeadImg} />
                                <h6 className={style.profileInnerTotalMatchesAchievementListItemHeadTitle}>
                                  {t('profileInnerTotalMatchesAchievementListItemHeadTitleTriple')}
                                </h6>
                              </div>
                              <p className={style.profileInnerTotalMatchesAchievementListItemSub}>
                                x {user.double_kill_count}
                              </p>
                            </li>
                            <li className={style.profileInnerTotalMatchesAchievementListItem}>
                              <div className={style.profileInnerTotalMatchesAchievementListItemHead}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerTotalMatchesAchievementListItemHeadImg} />
                                <h6 className={style.profileInnerTotalMatchesAchievementListItemHeadTitle}>
                                  {t('profileInnerTotalMatchesAchievementListItemHeadTitleLegend')}
                                </h6>
                              </div>
                              <p className={style.profileInnerTotalMatchesAchievementListItemSub}>
                                x {user.legendary_count}
                              </p>
                            </li>
                            <li className={style.profileInnerTotalMatchesAchievementListItem}>
                              <div className={style.profileInnerTotalMatchesAchievementListItemHead}>
                                <img src={iconInfo} alt="icon" className={style.profileInnerTotalMatchesAchievementListItemHeadImg} />
                                <h6 className={style.profileInnerTotalMatchesAchievementListItemHeadTitle}>
                                  {t('profileInnerTotalMatchesAchievementListItemHeadTitleMVP')}
                                </h6>
                              </div>
                              <p className={style.profileInnerTotalMatchesAchievementListItemSub}>
                                x {user.mvp_count}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ДЕТАЛІ ГРИ */}
              <div className={nav === 2 ? style.profileInnerHeaderInfo : style.profileInnerHeaderInfoDis}>
                <div className={style.profileInnerHeaderInfo2Nav}>
                  В Розробці!
                </div>
              </div>

              {/* НАЛАШТУВАННЯ */}
              <div className={nav === 3 ? style.profileInnerHeaderInfo : style.profileInnerHeaderInfoDis}>
                <div className={style.profileInnerHeaderInfo3Nav}>
                  В Розробці!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}

export default Profile;