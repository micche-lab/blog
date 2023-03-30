import { Content, createClient } from 'newt-client-js'
import { Archive, Article } from '../types/article'
import { Author } from '../types/author'
import { Tag } from '../types/tag'

const client = createClient({
  spaceUid: process.env.NEXT_PUBLIC_NEWT_SPACE_UID,
  token: process.env.NEXT_PUBLIC_NEWT_API_TOKEN,
  apiType: process.env.NEXT_PUBLIC_NEWT_API_TYPE as 'cdn' | 'api',
})

export const fetchApp = async () => {
  const app = await client.getApp({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
  })
  return app
}

export const fetchTags = async () => {
  const { items, total } = await client.getContents<Content & Tag>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_TAG_MODEL_UID,
    query: {
      depth: 1,
    },
  })

  const tags: (Content & Tag & { total: number })[] = []

  // Get the number of articles per tag
  await items.reduce(async (prevPromise, tag) => {
    await prevPromise
    const { total } = await client.getContents({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
      query: {
        tags: tag._id,
        select: ['slug'],
      },
    })
    tags.push({ ...tag, total })
  }, Promise.resolve())

  return {
    tags,
    total,
  }
}

export const fetchArticles = async (options?: {
  query?: Record<string, any>
  search?: string
  tag?: string
  author?: string
  year?: number
  page?: number
  limit?: number
}) => {
  const { query, search, tag, author, year, page, limit } = options || {}
  const _query = {
    ...(query || {}),
  }
  if (search) {
    _query.or = [
      {
        title: {
          match: search,
        },
      },
      {
        body: {
          match: search,
        },
      },
    ]
  }
  if (tag) {
    _query.tags = tag
  }
  if (author) {
    _query.author = author
  }
  if (year) {
    _query['_sys.createdAt'] = {
      gte: new Date(year.toString()).toISOString(),
      lt: new Date((year + 1).toString()).toISOString(),
    }
  }
  const _page = page || 1
  const _limit = limit || Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const _skip = (_page - 1) * _limit

  const { items, total } = await client.getContents<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 2,
      limit: _limit,
      skip: _skip,
      ..._query,
    },
  })

  return {
    articles: items,
    total,
  }
}

export const getPages = async (options?: {
  tag?: string
  author?: string
  year?: number
}) => {
  const { total } = await fetchArticles(options)
  const pages = Array(
    Math.ceil(total / Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10)
  )
    .fill(true)
    .map((value, index) => ({
      number: index + 1,
    }))
  return pages
}

export const fetchCurrentArticle = async (options: { slug: string }) => {
  const { slug } = options
  if (!slug) return null
  const article = await client.getFirstContent<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 2,
      slug,
    },
  })
  return article
}

export const fetchPreviousArticle = async (options: {
  createdAt: string
}): Promise<(Content & Article) | null> => {
  const { createdAt } = options
  const article = await client.getFirstContent<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 1,
      select: ['slug'],
      '_sys.createdAt': {
        gt: createdAt,
      },
      order: ['_sys.createdAt'],
    },
  })
  return article
}

export const fetchNextArticle = async (options: {
  createdAt: string
}): Promise<(Content & Article) | null> => {
  const { createdAt } = options
  const article = await client.getFirstContent<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 1,
      select: ['slug'],
      '_sys.createdAt': {
        lt: createdAt,
      },
      order: ['-_sys.createdAt'],
    },
  })
  return article
}

export const fetchAuthors = async () => {
  const { items, total } = await client.getContents<Content & Author>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_AUTHOR_MODEL_UID,
    query: {
      depth: 1,
    },
  })
  const authors: (Content & Author & { total: number })[] = []

  // Get the number of articles per tag
  await items.reduce(async (prevPromise, author) => {
    await prevPromise
    const { total } = await client.getContents({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
      query: {
        author: author._id,
        select: ['slug'],
      },
    })
    authors.push({ ...author, total })
  }, Promise.resolve())

  return {
    authors,
    total,
  }
}

export const fetchArchives = async () => {
  const archives: Archive[] = []
  const oldestArticle = await client.getFirstContent<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 1,
      order: ['_sys.createdAt'],
      select: ['slug', '_sys.createdAt'],
    },
  })
  if (!oldestArticle) return { archives }

  let currentYear = new Date(
    (oldestArticle && oldestArticle._sys.createdAt) || new Date()
  ).getFullYear()
  const thisYear = new Date().getFullYear()

  while (currentYear <= thisYear) {
    archives.splice(0, 0, {
      year: currentYear,
      count: 0,
    })
    currentYear++
  }
  await archives.reduce(async (prevPromise, archive) => {
    await prevPromise
    const { total } = await client.getContents({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
      query: {
        depth: 1,
        limit: 1,
        select: ['slug'],
        '_sys.createdAt': {
          gte: new Date(archive.year.toString()).toISOString(),
          lt: new Date((archive.year + 1).toString()).toISOString(),
        },
      },
    })
    archive.count = total
  }, Promise.resolve())

  return {
    archives,
  }
}
