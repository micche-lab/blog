import { Home, HomeProps } from '@/components/Home'
import {
  fetchApp,
  fetchArchives,
  fetchArticles,
  fetchAuthors,
  fetchTags,
  getPages,
} from '@/lib/api'

export default function CategoryPage(props: HomeProps) {
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

  const tag = tags.find((_tag) => _tag.slug === slug)
  const _page = Number(page) || 1
  const { articles, total } = tag
    ? await fetchArticles({
        tag: tag._id,
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
      tagSlug: slug,
      page: _page,
    },
  }
}

export async function getStaticPaths() {
  const { tags } = await fetchTags()
  const paths: { params: { slug: string; page: string } }[] = []
  await tags.reduce(async (prevPromise, tag) => {
    await prevPromise
    const pages = await getPages({
      tag: tag._id,
    })
    pages.forEach((page) => {
      paths.push({
        params: {
          slug: tag.slug,
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
