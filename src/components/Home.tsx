import { AppMeta, Content } from 'newt-client-js'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Cover } from './Cover'
import { Layout } from './Layout'
import { Tag } from '@/types/tag'
import { ArticleCard } from './ArticleCard'
import { Archive, Article } from '@/types/article'
import { Pagination } from './Pagination'
import { useMemo } from 'react'
import { Side } from './Side'
import { Author } from '@/types/author'

export interface HomeProps {
  app: AppMeta
  tags: (Content & Tag & { total: number })[]
  authors: (Content & Author & { total: number })[]
  archives: Archive[]
  articles: (Content & Article)[]
  total: number
  page?: number
  tagSlug?: string
  authorSlug?: string
  year?: number
}

export function Home({
  app,
  tags,
  authors,
  archives,
  articles,
  total,
  page = 1,
  tagSlug = '',
  authorSlug = '',
  year,
}: HomeProps) {
  const popularTags = useMemo(() => {
    return tags
      .filter((tag) => tag.total > 0)
      .sort((tag1, tag2) => (tag1.total > tag2.total ? -1 : 1))
      .slice(0, 10)
  }, [tags])

  const currentTag = useMemo(() => {
    return tags.find((tag) => tag.slug === tagSlug)
  }, [tags, tagSlug])

  const currentAuthor = useMemo(() => {
    return authors.find((tag) => tag.slug === authorSlug)
  }, [authors, authorSlug])

  const shouldDisplayCover = useMemo(() => {
    return app.cover?.value && !tagSlug && !authorSlug && !year
  }, [app.cover?.value, tagSlug, authorSlug, year])

  const headingText = useMemo(() => {
    if (currentTag) {
      return `タグ：${currentTag.name || currentTag.slug}`
    }
    if (currentAuthor) {
      return `${(currentAuthor && currentAuthor.fullName) || ''}の書いた記事`
    }
    if (year) {
      return `${year}年の記事`
    }
    return '記事一覧'
  }, [currentTag, currentAuthor, year])

  const paginationBasePath = useMemo(() => {
    if (tagSlug) {
      return `/tag/${tagSlug}`
    }
    if (authorSlug) {
      return `/author/${authorSlug}`
    }
    if (year) {
      return `/archive/${year}`
    }
    return ``
  }, [tagSlug, authorSlug, year])

  return (
    <Layout app={app}>
      <Head>
        <title>{app?.name || app?.uid || ''}</title>
        <link rel="icon" href="@/favicon.ico" />
      </Head>
      {shouldDisplayCover && <Cover app={app} />}
      <div className={styles.Container}>
        <div className={styles.Container_Inner}>
          <main className={styles.Articles}>
            <div className={styles.Articles_Inner}>
              <h2 className={styles.Articles_Heading}>{headingText}</h2>
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination
              total={total}
              current={page}
              basePath={paginationBasePath}
            />
          </main>
          <Side
            popularTags={popularTags}
            authors={authors}
            archives={archives}
          />
        </div>
      </div>
    </Layout>
  )
}
