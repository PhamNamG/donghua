"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import { Monitor, Cloud, Link, Flag, X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateReport } from "@/hooks/useReport"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { AxiosError } from "axios"
import { CombiningEpisode } from "@/app/(main)/xem-phim/[slug]/watch-client"

interface Product {
  _id: string
  seri: string
  isApproved: boolean
  view: number
  copyright?: string;
  slug: string
}

interface Category {
  _id: string
  name: string
  slug: string
  des: string
  type: string
  isMovie: string
  year: string
  time: string
  lang: string
  quality: string
  products: Product[]
}

interface Anime {
  name: string
  slug: string
  category: Category
  copyright: string
  dailyMotionServer?: string
  server2?: string
  link?: string
  voiceOverLink?: string
  voiceOverLink2?: string
}

interface VideoPlayerProps {
  anime: Anime
  episode: Product
  combiningEpisodes: CombiningEpisode | null
}

export function VideoPlayer({ anime, episode, combiningEpisodes }: VideoPlayerProps) {
  const [videoSource, setVideoSource] = useState<string | null>(null)
  const [currentServer, setCurrentServer] = useState<"dailymotion" | "server2" | "link" | "voiceOverLink" | "voiceOverLink2">("dailymotion")
  const [isLoading, setIsLoading] = useState(true)
  const playerRef = useRef<HTMLDivElement>(null)
  const { mutate: createReport, isPending: isReporting, isError: isReportError, reset: resetReport } = useCreateReport()
  const [reportComment, setReportComment] = useState("")
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)

  // State to track if component has mounted
  const [hasMounted, setHasMounted] = useState(false)
  
  // State for ad warning popup
  const [showAdWarning, setShowAdWarning] = useState(false)

  // Check localStorage for ad warning dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem('adWarningDismissed')
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const now = Date.now()
    
    // Show popup if never dismissed or dismissed more than 24 hours ago
    if (!dismissed || (now - dismissedTime) > 24 * 60 * 60 * 1000) {
      // Delay showing popup by 3 seconds
      const timer = setTimeout(() => {
        setShowAdWarning(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissAdWarning = () => {
    setShowAdWarning(false)
    localStorage.setItem('adWarningDismissed', Date.now().toString())
  }

  // Effect to set initial server preference
  useEffect(() => {
    if (!hasMounted && anime) {
      if (anime.voiceOverLink) {
        setCurrentServer("voiceOverLink")
      } else if (anime.voiceOverLink2) {
        setCurrentServer("voiceOverLink2")
      }
      setHasMounted(true)
    }
  }, [anime, hasMounted])

  useEffect(() => {
    if (!anime) {
      setVideoSource(null)
      return
    }

    setIsLoading(true)

    // Check if we have a combining episode first
    if (combiningEpisodes && combiningEpisodes.link1) {
      if (isValidUrl(combiningEpisodes.link1)) {
        setVideoSource(addAutoplayParams(combiningEpisodes.link1))
        setIsLoading(false)
        return
      }
    }

    const trySetVideoSource = (url: string | undefined): boolean => {
      if (url && isValidUrl(url)) {
        setVideoSource(addAutoplayParams(url))
        setIsLoading(false)
        return true
      }
      return false
    }

    const tryDailyMotion = (): boolean => {
      if (anime.dailyMotionServer && isValidUrl(anime.dailyMotionServer)) {
        setVideoSource(addAutoplayParams(anime.dailyMotionServer))
        setIsLoading(false)
        return true
      }
      return false
    }

    let sourceSet = false

    switch (currentServer) {
      case "dailymotion":
        sourceSet = tryDailyMotion()
        break
      case "server2":
        sourceSet = trySetVideoSource(anime.server2)
        break
      case "link":
        sourceSet = trySetVideoSource(anime.link)
        break
      case "voiceOverLink":
        sourceSet = trySetVideoSource(anime.voiceOverLink)
        break
      case "voiceOverLink2":
        sourceSet = trySetVideoSource(anime.voiceOverLink2)
        break
    }

    // If current server failed, try others in order
    if (!sourceSet) {
      sourceSet = tryDailyMotion() ||
        trySetVideoSource(anime.server2) ||
        trySetVideoSource(anime.link) ||
        trySetVideoSource(anime.voiceOverLink) ||
        trySetVideoSource(anime.voiceOverLink2)

      if (!sourceSet) {
        setVideoSource(null)
      }
    }

    setIsLoading(false)
  }, [anime, currentServer, combiningEpisodes])

  // Hàm thêm tham số autoplay vào URL
  const addAutoplayParams = (url: string): string => {
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('autoplay', '1')
      urlObj.searchParams.set('mute', '0')
      urlObj.searchParams.set('controls', '1')
      urlObj.searchParams.set('playsinline', '1')
      return urlObj.toString()
    } catch {
      return url
    }
  }

  // Function to validate URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  type ServerType = {
    id: "dailymotion" | "server2" | "link" | "voiceOverLink" | "voiceOverLink2";
    name: string;
    icon: React.ReactNode;
    tooltip: string;
  };

  const getAvailableServers = (data: Anime): ServerType[] => {
    const servers: ServerType[] = [];

    if (data.dailyMotionServer) {
      servers.push({
        id: "dailymotion",
        name: "Vietsub #1",
        icon: <Monitor className="h-3 w-3" />,
        tooltip: "Primary server (DailyMotion)",
      });
    }

    if (data.server2) {
      servers.push({
        id: "server2",
        name: "Vietsub #2",
        icon: <Cloud className="h-3 w-3" />,
        tooltip: "Backup server"
      });
    }

    if (data.link) {
      servers.push({
        id: "link",
        name: "Vietsub #3",
        icon: <Link className="h-3 w-3" />,
        tooltip: "Alternative source"
      });
    }

    if (data.voiceOverLink) {
      servers.push({
        id: "voiceOverLink",
        name: "Thuyết minh #1",
        icon: <Link className="h-3 w-3" />,
        tooltip: "Alternative source"
      });
    }

    if (data.voiceOverLink2) {
      servers.push({
        id: "voiceOverLink2",
        name: "Thuyết minh #2",
        icon: <Link className="h-3 w-3" />,
        tooltip: "Alternative source"
      });
    }

    return servers;
  };

  const availableServers = getAvailableServers(anime);

  return (
    <div className="flex flex-col gap-2">
      {/* Ad Warning Popup */}
      {showAdWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative mx-4 max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={dismissAdWarning}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
              Thông báo về quảng cáo
            </h3>

            {/* Message */}
            <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
              Server phim hiện đang có <span className="font-semibold text-amber-600 dark:text-amber-400">nhiều quảng cáo</span> hiện web không thể chặn.
              Để xem phim ít quảng cáo hơn, mọi người hãy tải trình duyệt <span className="font-semibold text-green-600 dark:text-green-400">Cốc Cốc</span> nhé!
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={dismissAdWarning}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Để sau
              </button>
              <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Đã hiểu
              </a>
            </div>
          </div>
        </div>
      )}
      <div ref={playerRef} className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        {/* Video iframe */}
        {videoSource ? (
          <iframe
            src={videoSource}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black text-white">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                <p>Đang tải video...</p>
              </div>
            ) : (
              "Đang cập nhật video..."
            )}
          </div>
        )}

        {/* Copyright Notice */}
        {episode && episode.copyright && (
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {episode.copyright}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Server Selection */}
        <div className="flex gap-2">
          {availableServers.map((server) => (
            <button
              key={server.id}
              onClick={() => setCurrentServer(server.id)}
              className={cn(
                "flex items-center px-3 py-1.5 rounded text-xs font-medium transition-all",
                currentServer === server.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700",
                combiningEpisodes ? "opacity-50 cursor-not-allowed" : ""
              )}
              title={server.tooltip}
              disabled={!!combiningEpisodes}
            >
              {server.icon}
              <span className="ml-1">{server.name}</span>
            </button>
          ))}
        </div>

        {/* Report Button */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogTrigger asChild>
            <Button
              size={'sm'}
              onClick={() => { resetReport(); }}
              className="flex items-center gap-1 text-xs"
              title="Báo lỗi video"
              variant={'outline'}
            >
              <Flag />
              Báo lỗi
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Báo lỗi video</DialogTitle>
              <DialogDescription>
                Mô tả ngắn gọn vấn đề bạn gặp phải (tùy chọn)
              </DialogDescription>
            </DialogHeader>
            <div className="mt-1">
              <textarea
                className="mt-1 w-full border rounded p-2 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                placeholder="Ví dụ: Không phát được, sai tập, âm thanh lỗi..."
                value={reportComment}
                onChange={(e) => { setReportComment(e.target.value); if (reportError) setReportError(null); }}
                rows={4}
              />
            </div>
            {reportError && (
              <p className="mt-2 text-xs text-red-600">{reportError}</p>
            )}
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReportOpen(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                disabled={isReporting}
                onClick={() => {
                  const trimmed = reportComment.trim()
                  if (!episode?.slug) {
                    setReportError("Thiếu thông tin tập phim")
                    return
                  }
                  if (trimmed) {
                    if (trimmed.length < 10 || trimmed.length > 500) {
                      setReportError("Nội dung báo cáo phải từ 10 đến 500 ký tự")
                      return
                    }
                    const spamLinkPattern = /(http|https|www|\.com|\.net|\.org)/i
                    if (spamLinkPattern.test(trimmed)) {
                      setReportError("Không được phép gửi link trong báo cáo")
                      return
                    }
                  }
                  createReport(
                    { productId: episode.slug, comment: trimmed || undefined },
                    {
                      onSuccess: (data: { message: string }) => {
                        setReportComment("")
                        setIsReportOpen(false)
                        toast.success(data.message)
                      },
                      onError: (error) => {
                        const err = error as AxiosError<{ message: string }>;
                        console.error(err.response?.data.message);
                      }
                    }
                  )
                }}
                className="text-xs"
              >
                {isReporting ? "Đang gửi..." : "Gửi báo lỗi"}
              </Button>
            </div>
            {isReportError && (
              <p className="mt-2 text-xs text-red-600">Gửi thất bại. Thử lại sau.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
