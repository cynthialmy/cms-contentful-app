import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPreviewPostBySlug } from '@/lib/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check the secret and next parameters
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // Check if the post exists
  const post = await getPreviewPostBySlug(slug)

  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  // Enable Draft Mode
  draftMode().enable()

  // Redirect to the path from the fetched post
  redirect(`/posts/${post.slug}`)
}
