import type { GhostPost } from "./ghost"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

export async function getTheorems(): Promise<GhostPost[]> {
  try {
    if (!apiUrl) {
      throw new Error("API URL is not defined")
    }

    const url = new URL("/ghost/api/v3/content/posts/", apiUrl)
    url.searchParams.append("key", apiKey || "")
    url.searchParams.append("limit", "500")
    url.searchParams.append("filter", "tag:kris-theorems")
    url.searchParams.append("include", "tags")

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.posts || data.posts.length === 0) {
      console.warn("No theorems found in the response.")
      return []
    }

    return data.posts
  } catch (error) {
    console.error("Error fetching theorems:", error)
    return []
  }
}

