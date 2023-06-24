import { useEffect, useState } from 'react'
import styles from '@/styles/Badge.module.css'
import { HiArrowSmUp } from 'react-icons/hi'

// トップに戻るボタン実装
const ReturnTopButton = () => {
    const [isButtonActive, setIsButtonActive] = useState(false)

    const returnTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // スムースに動く設定
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollWindow)
        return () => {
            window.removeEventListener('scroll', scrollWindow)
        }
    }, [])

    const scrollWindow = () => {
        const top = 300  //ボタンを表示させたい位置
        let scroll = 0
        scroll = window.scrollY
        if (top <= scroll) {
            setIsButtonActive(true)
        } else {
            setIsButtonActive(false)
        }
    }

    const normalStyle = {
        opacity: 0,
        transition: '0.5s',
        pointerEvents: 'none'
    }
    const activeStyle = {
        opacity: 1,
        transition: '0.5s'
    }
    const style = isButtonActive ? activeStyle : normalStyle

    return (
        <button onClick={returnTop} style={style}>
            <span className={styles.Badge}><HiArrowSmUp /></span>
        </button>
    );
}

export default ReturnTopButton