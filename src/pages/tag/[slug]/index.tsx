import { Home, HomeProps } from '@/components/Home'
import {
  fetchApp,
  fetchArchives,
  fetchArticles,
  fetchAuthors,
  fetchTags,
} from '@/lib/api'

export default function CategoryPage(props: HomeProps) {
  return <Home {...props} />
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string }
}): Promise<{ props: HomeProps }> {
  const { slug } = params
  const app = await fetchApp()
  const { tags } = await fetchTags()
  const { authors } = await fetchAuthors()
  const { archives } = await fetchArchives()

  const tag = tags.find((_tag) => _tag.slug === slug)
  const { articles, total } = tag
    ? await fetchArticles({
        tag: tag._id,
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
    },
  }
}

export async function getStaticPaths() {
  const { tags } = await fetchTags()
  return {
    paths: tags.map((category) => ({
      params: {
        slug: category.slug,
      },
    })),
    fallback: 'blocking',
  }
}
