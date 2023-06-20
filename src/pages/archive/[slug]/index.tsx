import {
  fetchApp,
  fetchArchives,
  fetchArticles,
  fetchAuthors,
  fetchTags,
} from '@/lib/api'
import { Home, HomeProps } from '@/components/Home'

export default function TopPage(props: HomeProps) {
  return <Home {...props} />
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string }
  redirect
}): Promise<{ props: HomeProps }> {
  const { slug } = params
  const app = await fetchApp()
  const { tags } = await fetchTags()
  const { authors } = await fetchAuthors()
  const { archives } = await fetchArchives()

  let year = Number(slug)
  if (Number.isNaN(year)) {
    year = new Date().getFullYear()
  }
  const { articles, total } = await fetchArticles({
    year,
  })

  return {
    props: {
      app,
      tags,
      authors,
      archives,
      articles,
      total,
      year,
    },
  }
}

export async function getStaticPaths() {
  const { archives } = await fetchArchives()
  return {
    paths: archives.map((archive) => ({
      params: {
        slug: archive.year.toString(),
      },
    })),
    fallback: 'blocking',
  }
}
