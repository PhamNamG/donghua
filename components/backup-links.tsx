"use client"

import { Send } from "lucide-react"
import MVLink from "./Link"

export function BackupLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <MVLink
        href="https://t.me/+3csZo_ZqWnY4NTU9"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
      >
        <Send className="h-4 w-4" style={{color: "#0088cc"}} />
        <span style={{color: "#0088cc"}}>Nhóm Telegram</span>
      </MVLink>
    </div>
  )
}
