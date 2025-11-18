"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import { Monitor, Cloud, Link, Shield, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { CombiningEpisode } from "@/app/(main)/xem-phim/[slug]/watch-client"
import { useCreateReport } from "@/hooks/useReport"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { AxiosError } from "axios"

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
  const [adBlockEnabled, setAdBlockEnabled] = useState(true)
  const [showAdBlockStatus, setShowAdBlockStatus] = useState(true)
  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { mutate: createReport, isPending: isReporting, isError: isReportError, reset: resetReport } = useCreateReport()
  const [reportComment, setReportComment] = useState("")
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)

  // State to track if component has mounted
  const [hasMounted, setHasMounted] = useState(false)
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
        setVideoSource(addAdBlockParams(combiningEpisodes.link1))
        setIsLoading(false)
        return
      }
    }

    const trySetVideoSource = (url: string | undefined): boolean => {
      if (url && isValidUrl(url)) {
        setVideoSource(addAdBlockParams(url))
        setIsLoading(false)
        return true
      }
      return false
    }

    const tryDailyMotion = (): boolean => {
      if (anime.dailyMotionServer && isValidUrl(anime.dailyMotionServer)) {
        setVideoSource(addAdBlockParams(anime.dailyMotionServer))
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

  // Hàm thêm tham số chặn quảng cáo vào URL
  const addAdBlockParams = (url: string): string => {
    if (!adBlockEnabled) return url

    try {
      const urlObj = new URL(url)

      // Các tham số để giảm quảng cáo
      const adBlockParams = {
        'autoplay': '1',
        'mute': '0',
        'controls': '1',
        'modestbranding': '1', // YouTube
        'rel': '0', // YouTube
        'showinfo': '0', // YouTube
        'iv_load_policy': '3', // YouTube
        'disablekb': '0',
        'fs': '1',
        'playsinline': '1',
        'widget': '1',
        'app': 'embed'
      }

      Object.entries(adBlockParams).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value)
      })

      return urlObj.toString()
    } catch {
      return url
    }
  }

  // Effect để chặn quảng cáo sau khi iframe load
  useEffect(() => {
    if (videoSource && adBlockEnabled) {
      const timer = setTimeout(() => {
        blockAdsAndPopups()
      }, 2000) // Chờ 2 giây để iframe load xong

      return () => clearTimeout(timer)
    }
  }, [videoSource, adBlockEnabled])

  // Effect để ẩn ad block status sau 3s
  useEffect(() => {
    if (adBlockEnabled) {
      setShowAdBlockStatus(true)
      const timer = setTimeout(() => {
        setShowAdBlockStatus(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [adBlockEnabled])

  // Function to validate URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const blockAdsAndPopups = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframeDoc = iframeRef.current.contentWindow.document

        const adSelectors = [
          '[id*="ad"]',
          '[class*="ad"]',
          '[class*="advertisement"]',
          '[class*="popup"]',
          '[class*="overlay"]',
          '.ad-container',
          '.ads',
          '.advertisement',
          '.popup-overlay',
          '.modal-overlay'
        ]

        adSelectors.forEach(selector => {
          const elements = iframeDoc.querySelectorAll(selector)
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.display = 'none !important'
              el.remove()
            }
          })
        })

        // Chặn window.open (popup)
        iframeRef.current.contentWindow.open = () => null

        // Chặn các sự kiện click không mong muốn
        iframeDoc.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'A' && target.getAttribute('target') === '_blank') {
            e.preventDefault()
            e.stopPropagation()
          }
        }, true)

      } catch {
        // Cross-origin restrictions - không thể truy cập iframe content
        console.log('Cannot access iframe content due to CORS policy')
      }
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
      <div ref={playerRef} className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        {/* Video iframe */}
        {videoSource ? (
          <iframe
            ref={iframeRef}
            src={videoSource}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            onLoad={adBlockEnabled ? blockAdsAndPopups : undefined}
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

        {/* Ad Block Status */}
        {adBlockEnabled && (
          <div
            className={cn(
              "absolute top-4 left-4 bg-green-600/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1 transition-opacity duration-300",
              showAdBlockStatus ? "opacity-100" : "opacity-0"
            )}
          >
            <Shield className="h-3 w-3" />
            <span>Ad Block ON</span>
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
                currentServer === server.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
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

        {/* Ad Block Toggle */}
        <div className="flex item-center gap-2">
          <button
            onClick={() => setAdBlockEnabled(!adBlockEnabled)}
            className={cn(
              "flex items-center px-3 py-1.5 rounded text-xs font-medium transition-all",
              adBlockEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            )}
            title={adBlockEnabled ? "Disable ad blocking" : "Enable ad blocking"}
          >
            <Shield className="h-3 w-3 mr-1" />
            {adBlockEnabled ? "Ad Block ON" : "Ad Block OFF"}
          </button>
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

    </div>
  )
}
