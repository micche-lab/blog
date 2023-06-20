import { AppMeta } from 'newt-client-js'
import { PropsWithChildren } from 'react'
import styles from '@/styles/Layout.module.css'
import { Badge } from './Badge'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout({
  app,
  children,
}: PropsWithChildren<{
  app: AppMeta
}>): JSX.Element {
  return (
    <div className={styles.Wrapper}>
      <Header app={app} />
      {children}
      <Footer app={app} />
      <Badge />
    </div>
  )
}
