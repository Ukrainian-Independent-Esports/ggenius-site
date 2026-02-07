import style from '../../assets/style/index.module.css'
import t from '../../Hooks/LangChange'
import { Link } from 'react-router-dom'
import Marquee from '../../Hooks/Marquee'
import { useRef, useState, useEffect } from 'react';
// IMAGES
import back from './img/back.webp'
import sue from './img/sue.webp'
import obs from './img/obs.webp'
import sword from './img/sword.webp'
import cup from './img/icon.webp'
import brain from './img/brain.webp'
import elementsBrain from './img/elementsBrain.webp'
import start from './img/start.webp'
import next from './img/next.webp'
import end from './img/end.webp'
import startZoom from './img/startZoom.webp'
import nextZoom from './img/nextZoom.webp'
import endZoom from './img/endZoom.webp'
import roadMap from './img/roadMap.webp'
import partners from './img/Partners.webp'
import partnersMob from './img/partnersMob.png'

import logo from '../Header/img/logo.png'
import star from './img/Star.svg'
import roadMapMob from './img/roadMapMob.png'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import useLangChange from '../../Hooks/LangChange';


const Home = () => {

  const t = useLangChange();
  const [chats, setChats] = useState([])
  const [chatInfo, setChatInfo] = useState([])

  useEffect(() => {
    if (!chats.length) return;

    Promise.all(
      chats.map(chat =>
        fetch(`https://ggenius-api.onrender.com/mlbb/get_chat_info.php?chat_id=${chat.chat_id}`)
          .then(res => res.json())
      )
    )
      .then(data => setChatInfo(data))
      .catch(console.error);

  }, [chats]);

  useEffect(() => {
    fetch('https://ggenius-api.onrender.com/mlbb/get_posts.php?table=chat_members')
      .then(g => g.json())
      .then(data => setChats(data))
      .catch(err => console.error(err))
  }, [])

  const hiddenChats = [
    -1001810336177,
    -1001635885431,
    -5058351939
  ]

  const visibleChats = chatInfo.filter((chat, index, self) =>
    index === self.findIndex(c => c.id === chat.id) &&
    !hiddenChats.includes(chat.id)
  );

  // chatInfo.forEach(chat => {
  //   console.log(chat.id, typeof chat.id);
  // });

  // console.log(chatInfo);
  // console.log(chats);

  return <>
    <section className={style.home}>
      <img className={style.imgBack} src={back} alt="" />
      <div className={style.homeInner}>
        <div className={style.homeinnerImgGroup}>
          <img className={style.homeInnerImgBlur} src={sue} alt="" />
          <img className={style.homeInnerImg} src={sue} alt="" />
        </div>
        <div className={style.container}>

          <div className={style.homeInnerContent}>
            <h1 className={style.homeInnerContentTitle}>
              {t('homeInnerContentTitle')}
            </h1>
            <p className={style.homeInnerContentSub}>
              {t('homeInnerContentSub')}
            </p>
            <Link to='https://t.me/ggeniusgg_bot' className={style.homeInnerContentLink}>
              {t('navLink')}
            </Link>
          </div>
        </div>
        <div className={style.homeinnerImgGroup2}>
          <img className={style.homeInnerImg2Blur} src={obs} alt="hero Obsidia blur" fetchPriority='high' />
          <img className={style.homeInnerImg2} src={obs} alt="hero Obsidia" />
        </div>

        <div className={style.homeInnerImgUnion}>Mobile Legends</div>
      </div>

      {/* <div className={style.stroke}>
        <div className={style.strokeTrack}>
          <div className={style.strokeGroup}>
            {stroke([star, logo, star, logo, star, logo, star, logo, star, logo, star, logo])}
          </div>
          <div className={style.strokeGroupRev}>
            {stroke([star, logo, star, logo, star, logo, star, logo, star, logo, star, logo])}
          </div>
        </div>
      </div> */}

      <Marquee images={[star, logo, star, logo, star, logo, star, logo, star, logo, star, logo]} styles={`${style.stroke}`} />
    </section>

    <section className={style.what}>
      <div className={style.container}>
        <div className={style.whatinner}>
          <div className={style.whatinnerHeader} data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="1200">
            <h1 className={style.whatinnerTitle}>
              {t('whatinnerTitle')}
            </h1>
            <p className={style.whatinnerSub}>
              {t('whatinnerSub')}
            </p>
          </div>
          <div className={style.slider}>
            <Swiper pagination={true} modules={[Pagination]} slidesPerView={1} className={style.mySwiper} style={{
              width: '380px',
              height: '370px'
            }}>
              <SwiperSlide style={{
                width: '100%',
                height: '364px',
                // margin: '0 0 0 -10px'
              }}>
                <li className={style.whatinnerListItemSword}>
                  <div className={style.whatinnerListItemGroupImg}>
                    <img className={style.whatinnerListItemImgRight} src={sword} alt="" />
                    <img className={style.whatinnerListItemImgLeft} src={sword} alt="" />
                  </div>
                  <h2 className={style.whatinnerListItemTitle}>
                    {t('whatinnerListItemTitle1')}
                  </h2>
                  <p className={style.whatinnerListItemSub}>
                    {t('whatinnerListItemSub1')}
                  </p>
                </li>
              </SwiperSlide>
              <SwiperSlide style={{
                width: '360px',
                height: '364px'
              }}>
                <li className={style.whatinnerListItemCup}>
                  <img className={style.whatinnerListItemImgCup} src={cup} alt="" />
                  <img className={style.whatinnerListItemImgCupFill} src={cup} alt="" />
                  <h2 className={style.whatinnerListItemTitle}>
                    {t('whatinnerListItemTitle2')}
                  </h2>
                  <p className={style.whatinnerListItemSub}>
                    {t('whatinnerListItemSub2')}
                  </p>
                </li>
              </SwiperSlide>
              <SwiperSlide style={{
                width: '360px',
                height: '364px'
              }}>
                <li className={style.whatinnerListItemFlag}>
                  <div className={style.whatinnerListItemImgFlag}>
                    <div className={style.whatinnerListItemImgFlag2}></div>
                  </div>
                  <h2 className={style.whatinnerListItemTitle}>
                    {t('whatinnerListItemTitle3')}
                  </h2>
                  <p className={style.whatinnerListItemSub}>
                    {t('whatinnerListItemSub3')}
                  </p>
                </li>
              </SwiperSlide>
              <SwiperSlide style={{
                width: '360px',
                height: '364px'
              }}>
                <li className={style.whatinnerListItemBrain}>
                  <div className={style.whatinnerListItemBrainGroup}>
                    <img className={style.whatinnerListItemImgBrain} src={brain} alt="" />
                    <img className={style.whatinnerListItemImgElBrain} src={elementsBrain} alt="" />

                  </div>
                  <h2 className={style.whatinnerListItemTitle}>
                    {t('whatinnerListItemTitle4')}
                  </h2>
                  <p className={style.whatinnerListItemSub}>
                    {t('whatinnerListItemSub4')}
                  </p>
                </li>
              </SwiperSlide>
            </Swiper>
            <ul className={style.whatinnerList}>
              <li className={style.whatinnerListItemSword} data-aos="fade-down">
                <div className={style.whatinnerListItemGroupImg}>
                  <img className={style.whatinnerListItemImgRight} src={sword} alt="" />
                  <img className={style.whatinnerListItemImgLeft} src={sword} alt="" />
                </div>
                <h2 className={style.whatinnerListItemTitle}>
                  {t('whatinnerListItemTitle1')}
                </h2>
                <p className={style.whatinnerListItemSub}>
                  {t('whatinnerListItemSub1')}
                </p>
              </li>
              <li className={style.whatinnerListItemCup} data-aos="fade-down">
                <img className={style.whatinnerListItemImgCup} src={cup} alt="" />
                <img className={style.whatinnerListItemImgCupFill} src={cup} alt="" />
                <h2 className={style.whatinnerListItemTitle}>
                  {t('whatinnerListItemTitle2')}
                </h2>
                <p className={style.whatinnerListItemSub}>
                  {t('whatinnerListItemSub2')}
                </p>
              </li>
              <li className={style.whatinnerListItemFlag} data-aos="fade-down">
                <div className={style.whatinnerListItemImgFlag}>
                  <div className={style.whatinnerListItemImgFlag2}></div>

                </div>
                <h2 className={style.whatinnerListItemTitle}>
                  {t('whatinnerListItemTitle3')}
                </h2>
                <p className={style.whatinnerListItemSub}>
                  {t('whatinnerListItemSub3')}
                </p>
              </li>
              <li className={style.whatinnerListItemBrain} data-aos="fade-down">
                <div className={style.whatinnerListItemBrainGroup}>
                  <img className={style.whatinnerListItemImgBrain} src={brain} alt="" />
                  <img className={style.whatinnerListItemImgElBrain} src={elementsBrain} alt="" />

                </div>
                <h2 className={style.whatinnerListItemTitle}>
                  {t('whatinnerListItemTitle4')}
                </h2>
                <p className={style.whatinnerListItemSub}>
                  {t('whatinnerListItemSub4')}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <span className={style.ellips1}></span>
      </div>
    </section>

    <section className={style.work}>
      <div className={style.container}>
        <div className={style.workInner}>
          <div className={style.workInnerHeder} data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="1200">
            <h2 className={style.workInnerTitle}>
              {t('workInnerTitle')}
            </h2>
            <p className={style.workInnerSub}>
              {t('workInnerSub')}
            </p>
            <Link to='https://t.me/@ggeniusgg_bot' className={style.workInnerLink}>
              {t('navLink')}
            </Link>
          </div>

          <ul className={style.workInnerList}>
            <li className={style.workInnerListItem} data-aos="zoom-out-right" data-aos-duration="700">
              <h3 className={style.workInnerListItemTitle}>
                {t('workInnerListItemTitleStart')}
              </h3>
              <div className={style.workInnerListItemGroup}>
                <img src={start} alt="" className={style.workInnerListItemGroupImg} />
                <img src={startZoom} alt="" className={style.workInnerListItemGroupImgStartZoom} />
              </div>
              <p className={style.workInnerListItemSub}>
                {t('workInnerListItemSubStart')}
              </p>
            </li>
            <span className={style.workInnerListSpan} data-aos="zoom-out-right"
              data-aos-duration="1000">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="157" viewBox="0 0 80 157" fill="none">
                <path d="M0 0V21.6207L59.4569 77.4741L0 138.733V156.75L79.2759 77.4741L0 0Z" fill="url(#paint0_linear_34_362)" />
                <path d="M0 57.6552V36.0345L45.0431 77.4741L0 126.121V102.698L25.2241 77.4741L0 57.6552Z" fill="url(#paint1_linear_34_362)" />
                <defs>
                  <linearGradient id="paint0_linear_34_362" x1="79.2759" y1="77.4741" x2="-5.3623" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00369B" />
                    <stop offset="1" stopColor="#00369B" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_34_362" x1="79.2759" y1="77.4741" x2="-5.3623" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00369B" />
                    <stop offset="1" stopColor="#00369B" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <li className={style.workInnerListItem} data-aos="zoom-out-right" data-aos-duration="1200">
              <h3 className={style.workInnerListItemTitle}>
                {t('workInnerListItemTitleNext')}
              </h3>
              <div className={style.workInnerListItemGroup}>
                <img src={next} alt="" className={style.workInnerListItemGroupImg} />
                <img src={nextZoom} alt="" className={style.workInnerListItemGroupImgNextZoom} />
              </div>
              <p className={style.workInnerListItemSubNext}>
                {t('workInnerListItemSubNext')}

              </p>
            </li>
            <span className={style.workInnerListSpan} data-aos="zoom-out-right" data-aos-duration="1400">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="157" viewBox="0 0 80 157" fill="none">
                <path d="M0 0V21.6207L59.4569 77.4741L0 138.733V156.75L79.2759 77.4741L0 0Z" fill="url(#paint0_linear_34_362)" />
                <path d="M0 57.6552V36.0345L45.0431 77.4741L0 126.121V102.698L25.2241 77.4741L0 57.6552Z" fill="url(#paint1_linear_34_362)" />
                <defs>
                  <linearGradient id="paint0_linear_34_362" x1="79.2759" y1="77.4741" x2="-5.3623" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00369B" />
                    <stop offset="1" stopColor="#00369B" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_34_362" x1="79.2759" y1="77.4741" x2="-5.3623" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00369B" />
                    <stop offset="1" stopColor="#00369B" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <li className={style.workInnerListItem} data-aos="zoom-out-right" data-aos-duration="1700">
              <h3 className={style.workInnerListItemTitle}>
                {t('workInnerListItemTitleEnd')}
              </h3>
              <div className={style.workInnerListItemGroup}>
                <img src={end} alt="" className={style.workInnerListItemGroupImg} />
                <img src={endZoom} alt="" className={style.workInnerListItemGroupImgEndZoom} />
              </div>
              <p className={style.workInnerListItemSubEnd}>
                {t('workInnerListItemSubEnd')}

              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section className={style.progress}>
      <div className={style.container}>
        <div className={style.progressInner}>
          <div className={style.progressInnerHeader} data-aos="fade-down"
            data-aos-duration="3000">
            <h3 className={style.progressInnerTitle} >
              {t('progressInnerTitle')}
            </h3>
          </div>
          <div className={style.progressInnerMap}>
            <ul className={style.progressInnerMapList} data-aos="fade-down"
              data-aos-duration="3500">
              <li className={style.progressInnerMapListItem}>
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle1')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub1')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} >
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle3')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub3')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} >
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle5')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub5')}
                </p>
              </li>
            </ul>
            <img src={roadMap} alt="" className={style.progressInnerMapRoad} />
            <img src={roadMapMob} alt="" className={style.progressInnerMapRoadMob} />
            <ul className={style.progressInnerMapListMob}>
              <li className={style.progressInnerMapListItem} data-aos="fade-up">
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle1')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub1')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} data-aos="fade-up">
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle2')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub2')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} data-aos="fade-up">
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle3')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub3')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} data-aos="fade-up">
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle4')}

                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub4')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem} data-aos="fade-up">
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle5')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub5')}
                </p>
              </li>
            </ul>

            <ul className={style.progressInnerMapListTwo} data-aos="fade-up"
              data-aos-duration="3500">
              <li className={style.progressInnerMapListItem} >
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle2')}
                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub2')}
                </p>
              </li>
              <li className={style.progressInnerMapListItem}>
                <h4 className={style.progressInnerMapListItemTitle}>
                  {t('progressInnerMapListItemTitle4')}

                </h4>
                <p className={style.progressInnerMapListItemSub}>
                  {t('progressInnerMapListItemSub4')}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className={style.partners}>
      <div className={style.container}>
        <Link to='https://t.me/is_mlbb' className={style.partnersInner} data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1000">
          <div className={style.partnersInnerCont}>
            <h4 className={style.partnersInnerContTitle}>
              {t('partnersInnerContTitle')}
            </h4>

            <p className={style.partnersInnerContSub}>
              {t('partnersInnerContSub')}
            </p>
            <span className={style.partnersInnerContLink}>
              {t('partnersInnerContLink')}
            </span>
          </div>
          <img className={style.partnersInnerImg} src={partners} alt='mllbb heroes' />
          <img className={style.partnersInnerImgMob} src={partnersMob} alt='mllbb heroes' />

        </Link>
      </div>
    </section>

    {/* <section className={style.chats}>
      <div className={style.container}>
        <div className={style.chatsInner}>
          <h6 className={style.chatsInnerTitle}>
            {t('chatsInnerTitle')}
          </h6>
          <div className={style.chatsInnerInfo}>
            <ul className={style.chatsInnerInfoList}>
              {
                visibleChats.map((chat, index) => (
                  <li className={style.chatsInnerInfoListItem} key={chat.id}      data-aos="fade-down"
                    data-aos-duration={`${600 * index}`}>
                    <img src={chat.avatar} alt="" className={style.chatsInnerInfoListItemImg} />
                    <h6 className={style.chatsInnerInfoListItemTitle}>{chat.title}</h6>
                    <p className={style.chatsInnerInfoListItemCount}></p>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </section> */}
  </>
}

export default Home;