import { ANIME_PATHS } from "@/constant/path.constant"
import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", `${ANIME_PATHS.BASE}/*`, "/xem-phim/*"],
      disallow: ["/api/*", "/admin/*", "/search", "/profile/*", "/login", "/register", "/reset-password"],
    },
    sitemap: (process.env.NEXT_PUBLIC_SITE_URL || 'https://hh3dtq.site') + "/sitemap.xml",
  }
}
