"use client"

import { Send, ExternalLink } from "lucide-react"
import MVLink from "./Link"
import MVImage from "./ui/image"
import { SOCIAL_LINKS } from "@/constant/social.constant"

export function BackupLinks({ className }: { className?: string }) {
  return (
    <div className="bg-muted/30 rounded-lg mb-6">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Liên kết dự phòng</h3>
      <div className={`${className || ''}`}>
        {/* Zalo Link */} 
        <MVLink
          href={SOCIAL_LINKS.ZALO}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
        >
          <MVImage
            src="/7044033_zalo_icon.svg"
            width={16}
            height={16}
            alt="Zalo"
            className="w-4 h-4"
          />
          <span className="text-sm text-foreground group-hover:text-primary">Nhóm Zalo</span>
        </MVLink>

        {/* Telegram Link */}
        <MVLink
          href="https://t.me/myang_03"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
        >
          <Send className="h-4 w-4 text-muted-foreground group-hover:text-primary " />
          <span className="text-sm text-foreground group-hover:text-primary">Nhóm Telegram</span>
        </MVLink>

        {/* Website phụ */}
        <MVLink
          href="https://hh3tqtm.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm text-foreground group-hover:text-primary">Truy cập web phụ nếu lag</span>
        </MVLink>
      </div>
    </div>
  )
}
