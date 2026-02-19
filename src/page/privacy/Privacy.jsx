import style from '../../assets/style/index.module.css'
import useLangChange from '../../Hooks/LangChange'

const Privacy = () => {
  const t = useLangChange()
  return <>
    <section className={style.privacy}>
      <div className={style.container}>
        <div className={style.privacyInner}>
          <h2 className={style.privacyInnerTitle}>
            {t('footerCopySubMobPrivacy')}
          </h2>
        </div>
      </div>
    </section>
  </>
}

export default Privacy;