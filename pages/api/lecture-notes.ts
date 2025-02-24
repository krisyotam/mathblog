import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'data')
  const fileContents = fs.readFileSync(jsonDirectory + '/lecture-notes.json', 'utf8')
  res.status(200).json(JSON.parse(fileContents))
}

