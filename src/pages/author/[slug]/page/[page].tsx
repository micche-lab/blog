import {
  fetchApp,
  fetchArchives,
  fetchArticles,
  fetchAuthors,
  fetchTags,
  getPages,
} from '@/lib/api'
import { Home, HomeProps } from '@/components/Home'

export default function TopPage(props: HomeProps) {
  return <Home {...props} />
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string; page: string }
}): Promise<{ props: HomeProps }> {
  const { slug, page } = params
  const app = await fetchApp()
  const { tags } = await fetchTags()
  const { authors } = await fetchAuthors()
  const { archives } = await fetchArchives()

  const author = authors.find((author) => author.slug === slug)
  const _page = Number(page) || 1
  const { articles, total } = author
    ? await fetchArticles({
        author: author._id,
        page: _page,
      })
    : { articles: [], total: 0 }

  return {
    props: {
      app,
      tags,
      authors,
      archives,
      articles,
      total,
      authorSlug: slug,
      page: _page,
    },
  }
}

export async function getStaticPaths() {
  const { authors } = await fetchAuthors()
  const paths: { params: { slug: string; page: string } }[] = []
  await authors.reduce(async (prevPromise, author) => {
    await prevPromise
    const pages = await getPages({
      author: author._id,
    })
    pages.forEach((page) => {
      paths.push({
        params: {
          slug: author.slug,
          page: page.number.toString(),
        },
      })
    })
  }, Promise.resolve())

  return {
    paths,
    fallback: 'blocking',
  }
}
