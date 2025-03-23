// app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/entities/user/server";

export async function GET(request: NextRequest) {
  // get cookie from req
  const cookie = request.cookies.get("session")?.value;
  // decrypt session
  const session = await sessionService.decrypt(cookie);

  // return userId or null, if session incorrect
  return NextResponse.json({ userId: session?.userId || null });
}
