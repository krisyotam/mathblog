import { NextResponse } from "next/server"
import testsData from "@/data/tests.json"

export async function GET() {
  return NextResponse.json(testsData)
}

