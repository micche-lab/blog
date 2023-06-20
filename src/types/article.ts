import { Content } from 'newt-client-js'
import { Author } from './author'
import { Tag } from './tag'

export interface Article {
  title: string
  slug: string
  meta: {
    title: string
    description: string
    ogImage: { src: string } | null
  }
  body: string
  coverImage: { src: string } | null
  author: (Content & Author) | null
  tags: (Content & Tag)[]
}

export type Archive = { year: number; count: number }
