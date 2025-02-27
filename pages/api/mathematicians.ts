import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jsonDirectory = path.join(process.cwd(), "data")
    const fileContents = fs.readFileSync(jsonDirectory + "/mathematicians.json", "utf8")
    const data = JSON.parse(fileContents)
    res.status(200).json(data)
  } catch (error) {
    console.error("Error reading mathematicians:", error)
    res.status(500).json({ error: "Failed to load mathematicians" })
  }
}

