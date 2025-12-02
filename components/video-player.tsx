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
  const [popupBlocked, setPopupBlocked] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [clickCount, setClickCount] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const popupWindowsRef = useRef<Window[]>([])
  const lastInteractionRef = useRef<number>(0)
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

  // Function to validate URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  // Add autoplay params to video URL
  const addAutoplayParams = (url: string): string => {
    try {
      const urlObj = new URL(url)

      // Add autoplay and other params
      urlObj.searchParams.set('autoplay', '1')
      urlObj.searchParams.set('muted', '0') // Không mute để có sound

      return urlObj.toString()
    } catch {
      return url
    }
  }

  // Check số clicks cần thiết dựa vào domain
  const getRequiredClicks = (url: string): number => {
    if (url.includes('loadvid')) return 4 // loadvid có nhiều layers + delayed popups
    if (url.includes('vevocloud')) return 2 // vevocloud có 2 layers
    return 0 // Không cần overlay
  }

  const requiredClicks = videoSource ? getRequiredClicks(videoSource) : 0
  const isLoadvid = videoSource?.includes('loadvid') || false

  // Monitor và đóng popup ads + detect redirects
  useEffect(() => {
    let isComponentMounted = true
    let initialWindowCount = window.length

    // Aggressive popup monitoring - Check every 50ms
    const popupChecker = setInterval(() => {
      if (!isComponentMounted) return

      // Check for new windows by counting
      if (window.length > initialWindowCount) {
        setPopupBlocked(prev => prev + 1)
        initialWindowCount = window.length
      }

      // Lọc các window đã đóng
      popupWindowsRef.current = popupWindowsRef.current.filter(win => !win.closed)

      // Đóng tất cả popup windows ngay lập tức
      popupWindowsRef.current.forEach(win => {
        try {
          if (!win.closed) {
            win.close()
            setPopupBlocked(prev => prev + 1)
          }
        } catch {
          // Ignore errors
        }
      })

      // Try to close any popup window that might have been opened
      // This catches popups we couldn't track via window.open override
      try {
        if (window.opener) {
          window.close()
        }
      } catch {
        // Ignore
      }
    }, 50) // Faster checking (50ms thay vì 100ms)

    // Override window.open globally để track và block popups
    const originalWindowOpen = window.open
    window.open = function (...args) {
      // Try to prevent popup completely
      setPopupBlocked(prev => prev + 1)
      
      const newWindow = originalWindowOpen.apply(this, args)
      if (newWindow) {
        popupWindowsRef.current.push(newWindow)
        
        // Close immediately (0ms)
        try {
          newWindow.close()
        } catch {
          // If immediate close fails, try again after 10ms
          setTimeout(() => {
            try {
              if (newWindow && !newWindow.closed) {
                newWindow.close()
              }
            } catch {
              // Ignore errors
            }
          }, 10)
        }
      }
      
      // Return null to indicate popup was blocked
      return null
    }

    // Detect blur events (tab switch / redirect) - AGGRESSIVE MODE
    const handleBlur = () => {
      // Always block blur during video watching (aggressive mode)
      setPopupBlocked(prev => prev + 1)
      
      // Focus back IMMEDIATELY
      if (isComponentMounted) {
        window.focus()
      }
    }

    // Detect visibility change - AGGRESSIVE MODE
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab bị hidden → có thể là popup/redirect
        setPopupBlocked(prev => prev + 1)
        
        // Try multiple times to focus back
        const focusAttempts = [0, 50, 100, 200]
        focusAttempts.forEach(delay => {
          setTimeout(() => {
            if (!document.hidden && isComponentMounted) {
              window.focus()
            }
          }, delay)
        })
      }
    }

    // Prevent beforeunload redirects
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      if (timeSinceInteraction < 3000) {
        // Might be unwanted redirect
        e.preventDefault()
        e.returnValue = ''
        setPopupBlocked(prev => prev + 1)
      }
    }

    window.addEventListener('blur', handleBlur, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange, { capture: true })
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true })

    return () => {
      isComponentMounted = false
      clearInterval(popupChecker)
      window.open = originalWindowOpen
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      // Đóng tất cả popups khi unmount
      popupWindowsRef.current.forEach(win => {
        try {
          if (!win.closed) win.close()
        } catch {
          // Ignore
        }
      })
    }
  }, [isLoadvid])

  // Reset popup counter và overlay khi đổi video
  useEffect(() => {
    setPopupBlocked(0)
    setClickCount(0)

    // Show overlay nếu cần
    if (videoSource) {
      const needsOverlay = requiredClicks > 0
      setShowOverlay(needsOverlay)
    } else {
      setShowOverlay(false)
    }
  }, [videoSource, requiredClicks])

  // Track user interaction với player
  useEffect(() => {
    const playerElement = playerRef.current
    if (!playerElement) return

    const handleInteraction = () => {
      lastInteractionRef.current = Date.now()
      setIsUserInteracting(true)
      // Reset sau 2s
      setTimeout(() => setIsUserInteracting(false), 2000)
    }

    playerElement.addEventListener('click', handleInteraction)
    playerElement.addEventListener('mousedown', handleInteraction)
    playerElement.addEventListener('touchstart', handleInteraction)

    return () => {
      playerElement.removeEventListener('click', handleInteraction)
      playerElement.removeEventListener('mousedown', handleInteraction)
      playerElement.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

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

  // Handle overlay click - ăn popup
  const handleOverlayClick = () => {
    const newClickCount = clickCount + 1
    setClickCount(newClickCount)
    setPopupBlocked(prev => prev + 1)

    // Ẩn overlay khi đã click đủ số lần required
    if (newClickCount >= requiredClicks) {
      setShowOverlay(false)
    }

    // Focus back ngay lập tức
    setTimeout(() => window.focus(), 0)
  }

  return (
    <div className="flex flex-col gap-2">
      <div ref={playerRef} className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        {/* Video iframe */}
        {videoSource ? (
          <>
            <iframe
              ref={iframeRef}
              src={videoSource}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Anti-popup Overlay */}
            {showOverlay && (
              <div
                className="absolute inset-0 z-30 cursor-pointer bg-black/0 hover:bg-black/5 transition-colors"
                onClick={handleOverlayClick}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-md">
                    {isLoadvid ? (
                      // loadvid warning
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            ⚠️ Server có nhiều quảng cáo
                          </span>
                        </div>

                        <div className="text-sm space-y-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            Server này có quá nhiều popup ads khó chặn
                          </p>

                          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg mt-3">
                            <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                              💡 Giải pháp:
                            </p>
                            <ul className="text-xs space-y-1 text-left text-gray-700 dark:text-gray-300">
                              <li>
                                • Chuyển sang <span className="font-semibold text-gray-900 dark:text-white">các server còn lại</span> - Không ads
                              </li>
                              <li>
                                • Hoặc <span className="font-semibold text-gray-900 dark:text-white">Vietsub #2</span> - Ít ads hơn
                              </li>
                              <li>
                                • Hoặc cài <span className="font-semibold text-gray-900 dark:text-white">uBlock Origin</span> extension
                              </li>
                            </ul>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowOverlay(false)
                            }}
                            className="w-full mt-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-white text-white dark:text-gray-900 font-semibold py-2 px-4 rounded pointer-events-auto transition-colors shadow-md"
                          >
                            Tôi hiểu, vẫn muốn xem
                          </button>
                        </div>
                      </>
                    ) : (
                      // vevocloud normal flow
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-6 h-6 animate-pulse" />
                          <span className="text-lg font-bold">Click để xem video</span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                          {clickCount === 0 ? (
                            <p>Click {requiredClicks} lần để chặn popup ads</p>
                          ) : clickCount < requiredClicks ? (
                            <p className="text-gray-900 dark:text-gray-100 font-semibold">Còn {requiredClicks - clickCount} click nữa...</p>
                          ) : (
                            <p className="text-gray-900 dark:text-gray-100 font-bold">✓ Đã chặn xong!</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
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
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
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

        {/* Report & Info */}
        <div className="flex item-center gap-2">
          {/* Popup Blocked Counter */}
          {popupBlocked > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-md">
              <Shield className="h-3.5 w-3.5 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-semibold">{popupBlocked} ads chặn</span>
                {isUserInteracting && (
                  <span className="text-[10px] opacity-80">Đang bảo vệ...</span>
                )}
              </div>
            </div>
          )}

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
