import { NextResponse } from "next/server"
import problemSetsData from "@/data/problem-sets.json"

export async function GET() {
  return NextResponse.json(problemSetsData)
}

