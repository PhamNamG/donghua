import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_MAX = 300
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // Get client IP for rate limiting
  const clientIP = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'

  const now = Date.now()
  const clientData = rateLimitMap.get(clientIP)

  if (clientData) {
    if (now > clientData.resetTime) {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    } else {
      if (clientData.count >= RATE_LIMIT_MAX) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Spam con cặc! Vui lòng đợi 15 phút trước khi gửi thêm request.'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
            }
          }
        )
      }
      // Increment count
      clientData.count++
      rateLimitMap.set(clientIP, clientData)
    }
  } else {
    // First request from this IP
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
  }

  // Redirect từ /d/... → /xem-phim/...
  if (pathname.startsWith('/d/')) {
    const newUrl = pathname.replace('/d/', '/xem-phim/')
    return NextResponse.redirect(`${origin}${newUrl}`, 301)
  }

  if (pathname.startsWith('/q/')) {
    const newUrl = pathname.replace('/q/', '/phim/')
    return NextResponse.redirect(`${origin}/${newUrl}`, 301)
  }

  return NextResponse.next()
}

// Clean up old entries periodically (every 15 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)
