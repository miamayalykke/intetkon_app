// ./app/api/disable-draft/route.ts

import { draftMode } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  var draft = await draftMode()
  draft.disable()
  const url = new URL(request.nextUrl)
  return NextResponse.redirect(new URL('/', url.origin))
}
