import { NextResponse } from "next/server"
import universitiesData from "@/data/universities.json"

export async function GET() {
  return NextResponse.json(universitiesData)
}

