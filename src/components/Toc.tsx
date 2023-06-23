import { useEffect } from 'react' //レンダリング後に行う関数
import tocbot from 'tocbot' //tocbotという名前で使えるようにする
import styles from '@/styles/Toc.module.css'

export default function TocBot() {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc', //目次表示させる要素のクラス名
      contentSelector: '.post', //目次を抽出したい要素のクラス名
      headingSelector: 'h2, h3', //抽出先見出しタグ
    })

    return () => tocbot.destroy()
  }, [])

  return (
    <div className={styles.toc_Header}>
      <span>目次</span>
      <div className={styles.toc}>

      </div>
    </div>
  )
}
