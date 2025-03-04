import { NextResponse } from "next/server"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ error: "Ghost API configuration is missing" }, { status: 500 })
  }

  try {
    const url = new URL(`/ghost/api/v3/content/posts/slug/${slug}`, apiUrl)
    url.searchParams.append("key", apiKey)
    url.searchParams.append("fields", "html,feature_image")

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Ghost API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.posts[0])
  } catch (error) {
    console.error("Error fetching from Ghost API:", error)
    return NextResponse.json({ error: "Failed to fetch content from Ghost" }, { status: 500 })
  }
}

