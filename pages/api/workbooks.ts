import { NextApiRequest, NextApiResponse } from 'next'; // Import NextApiRequest and NextApiResponse
import path from 'path';
import fs from 'fs';

// Handle the GET request for workbooks data
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'data'); // Path to your data folder
  const filePath = path.join(jsonDirectory, 'workbooks.json'); // Path to the JSON file
  const fileContents = fs.readFileSync(filePath, 'utf8'); // Read the JSON file

  // Return the JSON data as a Next.js response
  res.status(200).json(JSON.parse(fileContents));
}
