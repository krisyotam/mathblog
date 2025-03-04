import { NextResponse } from "next/server"
import institutesData from "@/data/research-facilities.json"

export async function GET() {
  return NextResponse.json(institutesData)
}

