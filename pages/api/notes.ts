import type { NextApiRequest, NextApiResponse } from "next"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apiUrl) {
    return res.status(500).json({ error: "Ghost API URL is not configured" })
  }

  try {
    const url = new URL("/ghost/api/v3/content/posts/", apiUrl)
    url.searchParams.append("key", apiKey || "")
    url.searchParams.append("filter", "tag:krismathblog-notes")
    url.searchParams.append("limit", "all")
    url.searchParams.append("include", "tags")

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }

    const data = await response.json()
    res.status(200).json(data.posts)
  } catch (error) {
    console.error("Error fetching notes:", error)
    res.status(500).json({ error: "Failed to fetch notes" })
  }
}

