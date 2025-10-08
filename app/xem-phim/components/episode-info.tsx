"use client";

import { Calendar, Clock } from "lucide-react";
import { BackupLinks } from "@/components/backup-links";

interface EpisodeInfoProps {
  name: string;
  seri: string;
  isMovie: string;
  createdAt: string;
  time: string;
  className?: string;
  titleSize?: string;
}

export function EpisodeInfo({
  name,
  seri,
  isMovie,
  createdAt,
  time,
  className = "",
  titleSize = "text-xl"
}: EpisodeInfoProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className={`${titleSize} font-bold mb-3`}>
        {isMovie === 'drama' ? `${name} - Tập ${seri}` : name}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {isMovie === 'drama' && `Tập ${seri}`}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            Đăng tải: {new Date(createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <BackupLinks />
      </div>

    </div>
  );
}
