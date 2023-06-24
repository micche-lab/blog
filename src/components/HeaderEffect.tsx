import { useEffect } from 'react'

// ヘッダー部分スクロールで表示・非表示
export default function HeaderEffect() {
    // ページ全体のイベントハンドラを登録
    // useEffectでDOM更新後のコード実行とする
    useEffect(() => {
        const header = document.querySelector("header"),
            headerStyle = window.getComputedStyle(header),
            headerHeight = parseFloat(headerStyle.height);

        let lastPosition = 0;

        document.addEventListener("scroll", () => {
            const currentPosition = window.scrollY,
                diff = currentPosition - lastPosition;

            let newTop = parseFloat(headerStyle.top) - diff;
            if (diff < 0) {
                newTop = Math.min(newTop, 0);
            } else {
                newTop = Math.max(newTop, 0 - headerHeight);
            }

            header.style.top = `${newTop}px`;
            lastPosition = currentPosition;
        });
    },[])

    return (
        <></>
    );
}