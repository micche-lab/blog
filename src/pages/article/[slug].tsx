import { Layout } from '@/components/Layout'
import {
  fetchApp,
  fetchArticles,
  fetchCurrentArticle,
  fetchNextArticle,
  fetchPreviousArticle,
} from '@/lib/api'
import { formatDate } from '@/lib/date'
import styles from '@/styles/Article.module.css'
import { Article } from '@/types/article'
import { load } from 'cheerio'
import { htmlToText } from 'html-to-text'
import { AppMeta, Content } from 'newt-client-js'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { AiFillFacebook, AiOutlineTwitter } from 'react-icons/ai'

export default function ArticlePage({
  app,
  currentArticle,
  prevArticle,
  nextArticle,
}: {
  app: AppMeta
  currentArticle: (Content & Article) | null
  prevArticle: (Content & Article) | null
  nextArticle: (Content & Article) | null
}) {
  const meta = useMemo(() => {
    if (currentArticle?.meta) {
      return currentArticle.meta
    }
    return null
  }, [currentArticle])

  const title = useMemo(() => {
    if (meta?.title) {
      return meta.title
    }
    if (currentArticle?.title) {
      return currentArticle.title
    }
    return app.name || app.uid || ''
  }, [app, meta, currentArticle?.title])

  const description = useMemo(() => {
    if (meta?.description) {
      return meta.description
    }
    if (currentArticle?.body) {
      return htmlToText(currentArticle.body, {
        selectors: [{ selector: 'img', format: 'skip' }],
      }).slice(0, 200)
    }
    return ''
  }, [meta, currentArticle?.body])

  const ogImage = useMemo(() => {
    if (meta?.ogImage) {
      return meta.ogImage.src
    }
    if (currentArticle?.author?.profileImage) {
      return currentArticle.author.profileImage.src
    }
    return ''
  }, [meta?.ogImage, currentArticle?.author])

  const authorName = useMemo(() => {
    return currentArticle?.author?.fullName || 'NO NAME'
  }, [currentArticle?.author?.fullName])

  const publishDate = useMemo(() => {
    return currentArticle?._sys?.createdAt
      ? formatDate(currentArticle._sys.createdAt)
      : ''
  }, [currentArticle?._sys?.createdAt])

  const body = useMemo(() => {
    if (currentArticle?.body) {
      return {
        __html: currentArticle.body,
      }
    }
    return {
      __html: '',
    }
  }, [currentArticle?.body])

  const authorBio = useMemo(() => {
    if (currentArticle?.author?.biography) {
      return {
        __html: currentArticle.author.biography,
      }
    }
    return {
      __html: '',
    }
  }, [currentArticle?.author?.biography])

  const shareOnTwitter = useCallback(() => {
    window.open(
      'https://twitter.com/share?url=' +
      encodeURIComponent(window.location.href) +
      '&text=' +
      document.title,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600'
    )
  }, [])

  const shareOnFacebook = useCallback(() => {
    window.open(
      '//www.facebook.com/sharer.php?src=bm&u=' +
      encodeURIComponent(location.href),
      '_blank',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600'
    )
  }, [])

  return (
    <Layout app={app}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.Container}>
        {/* 記事部分 */}
        <article v-if="currentArticle" className={styles.Article}>
          {/* 記事のカバー写真 */}
          <div className={styles.Article_Cover}>
            <img src={currentArticle.coverImage.src} alt="" />
          </div>
          {/* 記事ヘッダー部分 */}
          <div className={styles.Article_Header}>
            {/* タイトルエリア */}
            <h1 className={styles.Article_Title}>{currentArticle.title}</h1>
            {/* タグエリア */}
            <ul className={styles.Article_Tags}>
              {currentArticle.tags.map((tag) => (
                <li key={tag._id}>
                  <Link href={`/tag/${tag.slug}`}>
                    <a>#{tag.name}</a>
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.Article_Row}>
              {/* 投稿日 */}
              <time dateTime={publishDate} className={styles.Article_Date}>
                投稿日 : {publishDate}
              </time>
              {/* <div className={styles.Article_Author}>
              
                <a href="#" className={styles.Article_Avatar}>
                  {currentArticle.author?.profileImage?.src ? (
                    <img
                      src={currentArticle.author.profileImage.src}
                      alt=""
                      width="32"
                      height="32"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="#CCCCCC"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </a>
                <div className={styles.Article_AuthorData}>
                  <Link href={`/author/${currentArticle.author.slug}`}>
                    <a className={styles.Article_AuthorName}>{authorName}</a>
                  </Link>
                  <time dateTime={publishDate} className={styles.Article_Date}>
                    {publishDate}
                  </time>
                </div>
              </div> */}

              {/* 記事上シェア部分 */}
              <div className={styles.Article_Share}>
                <p className={styles.Article_ShareLabel}>記事の共有</p>
                <ul className={styles.Article_ShareList}>
                  <li>
                    <button type="button" onClick={shareOnTwitter}>
                      <AiOutlineTwitter />
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={shareOnFacebook}>
                      <AiFillFacebook />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 記事本文 */}
          <div
            className={styles.Article_Body}
            dangerouslySetInnerHTML={body}
          ></div>
          {/* ここまで */}

          {/* 記事下シェア部分 */}
          <div className={styles.SnsShare}>
            <p className={styles.SnsShare_Label}>共有</p>
            <ul className={styles.SnsShare_List}>
              <li>
                <button type="button" onClick={shareOnTwitter}>
                  <AiOutlineTwitter />
                </button>
              </li>
              <li>
                <button type="button" onClick={shareOnFacebook}>
                  <AiFillFacebook />
                </button>
              </li>
            </ul>
          </div>

          {/* 記事の著者部分 */}
          <aside className={styles.Author}>
            <a href="#" className={styles.Author_Avatar}>
              {currentArticle.author?.profileImage?.src ? (
                <img
                  src={currentArticle.author.profileImage.src}
                  alt=""
                  width="48"
                  height="48"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28px"
                  height="28px"
                  viewBox="0 0 24 24"
                  fill="#CCCCCC"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </a>
            <div className={styles.Author_Text}>
              <Link href={`/author/${currentArticle.author.slug}`}>
                <a className={styles.Article_AuthorName}>{authorName}</a>
              </Link>
              <div
                className={styles.Author_Description}
                dangerouslySetInnerHTML={authorBio}
              ></div>
            </div>
          </aside>

          {/* ページネーション */}
          <nav className={styles.Links}>
            {prevArticle && (
              <Link href={`/article/${prevArticle.slug}`}>
                <a className={styles.Links_Previous}>
                  <HiOutlineChevronLeft />前へ
                </a>
              </Link>
            )}
            {nextArticle && (
              <Link href={`/article/${nextArticle.slug}`}>
                <a className={styles.Links_Next}>
                  次へ
                  <HiOutlineChevronRight />
                </a>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </Layout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params
  const app = await fetchApp()
  const currentArticle = await fetchCurrentArticle({ slug })

  /*-----------------------
    ここからcheerioライブラリ 
  ------------------------*/

  // loadでcheerioライブラリ呼び出し
  const $ = load(currentArticle.body);
  // 見出しタグ抽出
  const headerTags = $('h2, h3, h4');

  // 初めのh2タグの直前に目次生成
  $('<div class="toc"><ul></ul></div>').insertBefore('h2:first-child');

  // 見出しタグ分eachで繰り返し処理
  headerTags.each(function (index, elm) {

    // 見出しタグのtext部分のみ抽出
    const headerText = $(elm).text();

    // ulタグの中にindex分見出しタグのリスト(リンク付き)を作る
    $('.toc > ul').append(`<li><a href=#${index}>${headerText}</a></li>`);

    // 見出しにid付与
    $(elm)
      .contents()
      .wrap(`<span id="${index}"></span>`);
  })

  currentArticle.body = $.html(); //今までの処理を反映

  /*--------------------- 
    cheerioライブラリおわり
  ----------------------*/


  const prevArticle = currentArticle
    ? await fetchPreviousArticle({ createdAt: currentArticle._sys.createdAt })
    : null
  const nextArticle = currentArticle
    ? await fetchNextArticle({ createdAt: currentArticle._sys.createdAt })
    : null

  return {
    props: {
      app,
      currentArticle,
      prevArticle,
      nextArticle,
    },
  }
}

export async function getStaticPaths() {
  const { articles } = await fetchArticles({
    limit: 1000,
  })
  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: 'blocking',
  }
}
