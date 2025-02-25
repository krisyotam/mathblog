import type { NextApiRequest, NextApiResponse } from "next"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!apiUrl) {
    return res.status(500).json({ error: "Ghost API URL is not configured" })
  }

  try {
    const url = new URL("/ghost/api/v3/content/posts/", apiUrl)
    url.searchParams.append("key", apiKey || "")
    url.searchParams.append("filter", `slug:${slug}`)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.posts || data.posts.length === 0) {
      return res.status(404).json({ error: "Note not found" })
    }

    res.status(200).json(data.posts[0])
  } catch (error) {
    console.error("Error fetching note:", error)
    res.status(500).json({ error: "Failed to fetch note" })
  }
}

