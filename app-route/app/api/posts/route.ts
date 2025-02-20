import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    console.log("req =>", searchParams.get("name"))
    return NextResponse.json("/api/posts", { status: 200 })
}

export async function POST(req: Request) {
    const body = await req.json()
    return NextResponse.json({ payload: body }, { status: 200 })
}

// export async function PUT(req: Request) {

// }

// export async function DELETE(req: Request) {

// }

// export async function PATCH(req: Request) {

// }