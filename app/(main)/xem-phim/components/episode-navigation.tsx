"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MVLink from "@/components/Link";
import { ANIME_PATHS } from "@/constant/path.constant";

interface EpisodeNavigationProps {
  prevEpisode?: string;
  nextEpisode?: string;
  className?: string;
}

export function EpisodeNavigation({ 
  prevEpisode, 
  nextEpisode, 
  className = "" 
}: EpisodeNavigationProps) {
  if (!prevEpisode && !nextEpisode) return null;

  return (
    <div className={`flex gap-2 mb-3 ${className}`}>
      {prevEpisode && (
        <Button variant="outline" size="sm" asChild>
          <MVLink
            href={`${ANIME_PATHS.WATCH}/${prevEpisode}`}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Tập trước
          </MVLink>
        </Button>
      )}
      {nextEpisode && (
        <Button variant="outline" size="sm" asChild>
          <MVLink
            href={`${ANIME_PATHS.WATCH}/${nextEpisode}`}
            className="flex items-center gap-1"
          >
            Tập sau
            <ChevronRight className="h-4 w-4" />
          </MVLink>
        </Button>
      )}
    </div>
  );
}
