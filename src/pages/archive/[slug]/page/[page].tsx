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
  redirect
}): Promise<{ props: HomeProps }> {
  const { slug, page } = params
  const app = await fetchApp()
  const { tags } = await fetchTags()
  const { authors } = await fetchAuthors()
  const { archives } = await fetchArchives()

  let year = Number(slug)
  if (Number.isNaN(year)) {
    year = new Date().getFullYear()
  }
  const _page = Number(page) || 1
  const { articles, total } = await fetchArticles({
    year,
    page: _page,
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
      page: _page,
    },
  }
}

export async function getStaticPaths() {
  const { archives } = await fetchArchives()
  const paths: { params: { slug: string; page: string } }[] = []
  await archives.reduce(async (prevPromise, archive) => {
    await prevPromise
    const pages = await getPages({
      year: archive.year,
    })
    pages.forEach((page) => {
      paths.push({
        params: {
          slug: archive.year.toString(),
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
