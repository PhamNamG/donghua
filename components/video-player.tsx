"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import { Monitor, Cloud, Link, Shield, Flag } from "lucide-react"
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
  const [adBlockEnabled, setAdBlockEnabled] = useState(true)
  const [showAdBlockStatus, setShowAdBlockStatus] = useState(true)
  const [popupBlocked, setPopupBlocked] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayClicks, setOverlayClicks] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastInteractionRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const { mutate: createReport, isPending: isReporting, isError: isReportError, reset: resetReport } = useCreateReport()
  const [reportComment, setReportComment] = useState("")
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)

  // State to track if component has mounted
  const [hasMounted, setHasMounted] = useState(false)
  
  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
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

  const isLoadvid = videoSource?.includes('loadvid') || false
  const isVevocloud = videoSource?.includes('vevocloud') || false

  // 🔥 NUCLEAR OPTION: Transparent Overlay + RAF Focus Loop
  useEffect(() => {
    if (!adBlockEnabled) return

    let isComponentMounted = true

    // 1. Override window.open - ALWAYS return null
    const originalWindowOpen = window.open
    window.open = function () {
      setPopupBlocked(prev => prev + 1)
      // Immediate focus back
      window.focus()
      requestAnimationFrame(() => window.focus())
      return null // Don't open anything
    }

    // 2. 🚀 RAF Focus Loop - Smoother than setInterval
    const focusLoop = () => {
      if (!isComponentMounted) return
      
      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      const activeWindow = isMobile ? 5000 : 3000 // Longer for mobile
      
      if (timeSinceInteraction < activeWindow) {
        if (document.hidden || !document.hasFocus()) {
          setPopupBlocked(prev => prev + 1)
          
          // Desktop: window.focus() works
          if (!isMobile) {
            window.focus()
          } else {
            // Mobile: Try alternative methods
            try {
              // Method 1: Try to scroll (brings focus back on some browsers)
              window.scrollTo(window.scrollX, window.scrollY)
              
              // Method 2: Try to focus on document
              if (document.body) {
                document.body.focus()
              }
              
              // Method 3: Dispatch focus event
              window.dispatchEvent(new Event('focus'))
            } catch {
              // Ignore errors
            }
          }
        }
      }
      
      rafRef.current = requestAnimationFrame(focusLoop)
    }
    rafRef.current = requestAnimationFrame(focusLoop)

    // 3. Instant blur detection - Focus back IMMEDIATELY
    const handleBlur = (e: FocusEvent) => {
      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      if (timeSinceInteraction < 2000) { // Within 2s of click
        e.preventDefault()
        e.stopPropagation()
        setPopupBlocked(prev => prev + 1)
        
        // Immediate focus back - RAF for smoothness
        window.focus()
        requestAnimationFrame(() => window.focus())
        setTimeout(() => window.focus(), 0)
        setTimeout(() => window.focus(), 10)
        setTimeout(() => window.focus(), 20)
      }
    }

    // 4. Visibility change - Focus back when tab becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSinceInteraction = Date.now() - lastInteractionRef.current
        if (timeSinceInteraction < 2000) { // Within 2s of click
          setPopupBlocked(prev => prev + 1)
          
          // RAF + setTimeout combo
          requestAnimationFrame(() => window.focus())
          setTimeout(() => window.focus(), 0)
          setTimeout(() => window.focus(), 50)
          setTimeout(() => window.focus(), 100)
        }
      }
    }

    // 5. Prevent page unload during interaction
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      if (timeSinceInteraction < 1000) { // Within 1s - likely unwanted redirect
        e.preventDefault()
        e.returnValue = ''
        setPopupBlocked(prev => prev + 1)
      }
    }

    // 6. Block ALL clicks during overlay (catch target="_blank" links)
    const blockClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if clicking on a link or inside iframe
      if (target.tagName === 'A' || target.closest('a') || target.tagName === 'IFRAME') {
        const timeSinceInteraction = Date.now() - lastInteractionRef.current
        if (timeSinceInteraction < 500) { // Very recent click - might be ad
          const link = target.tagName === 'A' ? target : target.closest('a')
          if (link && (link as HTMLAnchorElement).target === '_blank') {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            setPopupBlocked(prev => prev + 1)
          }
        }
      }
    }

    window.addEventListener('blur', handleBlur, true)
    document.addEventListener('visibilitychange', handleVisibilityChange, true)
    window.addEventListener('beforeunload', handleBeforeUnload, true)
    document.addEventListener('click', blockClicks, true)

    return () => {
      isComponentMounted = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.open = originalWindowOpen
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', blockClicks)
    }
  }, [videoSource, adBlockEnabled])

  // 🛡️ Overlay Protection: Show overlay for first few clicks on loadvid/vevocloud
  useEffect(() => {
    if (!videoSource || !adBlockEnabled) return
    
    const needsOverlay = isLoadvid || isVevocloud
    
    // 📱 Mobile needs MORE clicks because focus() doesn't work well
    let requiredClicks = 0
    if (isLoadvid) {
      requiredClicks = isMobile ? 5 : 3  // 5 for mobile, 3 for desktop
    } else if (isVevocloud) {
      requiredClicks = isMobile ? 3 : 2  // 3 for mobile, 2 for desktop
    }
    
    if (needsOverlay && requiredClicks > 0) {
      setShowOverlay(true)
      setOverlayClicks(0)
    }
  }, [videoSource, adBlockEnabled, isLoadvid, isVevocloud, isMobile])

  // Reset popup counter khi đổi video
  useEffect(() => {
    setPopupBlocked(0)
  }, [videoSource])

  // Track user interaction với player
  useEffect(() => {
    const playerElement = playerRef.current
    if (!playerElement) return

    const handleInteraction = () => {
      lastInteractionRef.current = Date.now()
      
    }

    playerElement.addEventListener('click', handleInteraction, { capture: true })
    playerElement.addEventListener('mousedown', handleInteraction, { capture: true })
    playerElement.addEventListener('touchstart', handleInteraction, { capture: true })

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
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer"
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

        {/* Ad Block Status - Enhanced */}
        {adBlockEnabled && (
          <div
            className={cn(
              "absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-opacity duration-300",
              showAdBlockStatus ? "opacity-100" : "opacity-0"
            )}
          >
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-semibold">Ad Block Active</span>
          </div>
        )}

        {/* 🛡️ Transparent Overlay - Eats first clicks to prevent popups */}
        {showOverlay && videoSource && (() => {
          const requiredClicks = isLoadvid 
            ? (isMobile ? 5 : 3) 
            : (isVevocloud ? (isMobile ? 3 : 2) : 0)
          
          const handleOverlayInteraction = (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault()
            e.stopPropagation()
            
            const newClickCount = overlayClicks + 1
            setOverlayClicks(newClickCount)
            setPopupBlocked(prev => prev + 1)
            
            if (newClickCount >= requiredClicks) {
              setShowOverlay(false)
              setOverlayClicks(0)
            }
            
            // Track interaction
            lastInteractionRef.current = Date.now()
          }
          
          return (
            <div
              className="absolute inset-0 z-50 cursor-pointer bg-black/10 backdrop-blur-[1px] flex items-center justify-center"
              onClick={handleOverlayInteraction}
              onTouchEnd={handleOverlayInteraction}
              onTouchStart={(e) => {
                e.preventDefault()
                lastInteractionRef.current = Date.now()
              }}
            >
              <div className="bg-blue-600/95 text-white px-6 py-4 rounded-xl shadow-2xl text-center backdrop-blur-sm max-w-xs">
                <Shield className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-bold mb-1">
                  {isLoadvid ? "🛡️ Chặn quảng cáo Loadvid" : "🛡️ Chặn quảng cáo"}
                </p>
                <p className="text-xs opacity-90 mb-1">
                  {isMobile ? "Tap" : "Click"} {requiredClicks} lần để tiếp tục
                </p>
                {isMobile && (
                  <p className="text-[10px] opacity-75 mb-2">
                    (Mobile cần nhiều {isMobile ? "tap" : "click"} hơn)
                  </p>
                )}
                <div className="mt-2 flex gap-1.5 justify-center flex-wrap">
                  {Array.from({ length: requiredClicks }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i < overlayClicks ? "bg-white scale-125" : "bg-white/30"
                      )}
                    />
                  ))}
                </div>
                <div className="mt-2 text-xs opacity-80">
                  {overlayClicks}/{requiredClicks}
                </div>
              </div>
            </div>
          )
        })()}
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

        {/* Protection Status & Report */}
        <div className="flex items-center gap-2">
          {/* Popup Blocked Counter */}
          {popupBlocked > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-md">
              <Shield className="h-3.5 w-3.5 animate-pulse" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold">{popupBlocked} popup{popupBlocked > 1 ? 's' : ''}</span>
                <span className="text-[10px] opacity-90">đã chặn</span>
              </div>
            </div>
          )}

          {/* Ad Block Toggle (Compact) */}
          <button
            onClick={() => setAdBlockEnabled(!adBlockEnabled)}
            className={cn(
              "flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm",
              adBlockEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-500 text-white hover:bg-red-600"
            )}
            title={adBlockEnabled ? "Tắt chặn quảng cáo" : "Bật chặn quảng cáo"}
          >
            <Shield className={cn("h-3.5 w-3.5 mr-1", adBlockEnabled && "animate-pulse")} />
            {adBlockEnabled ? "ON" : "OFF"}
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