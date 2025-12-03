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
  const [clickEaterActive, setClickEaterActive] = useState(true)
  const [eatenClicks, setEatenClicks] = useState(0)
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
      if (playerRef.current) {
        setAdBlockEnabled(true)
      }
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
    // 🎯 XÓA #dontfoid TỪ DOCUMENT CHÍNH (nằm ngoài iframe)
    const dontfoidElement = document.getElementById('dontfoid')
    if (dontfoidElement) {
      dontfoidElement.remove()
      console.log('🗑️ Removed #dontfoid on iframe load')
      setPopupBlocked(prev => prev + 1)
    }

    // Xóa tất cả elements có id chứa "dontfoid"
    document.querySelectorAll('[id*="dontfoid"]').forEach(el => {
      if (el instanceof HTMLElement) {
        el.remove()
        setPopupBlocked(prev => prev + 1)
      }
    })

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

  // 🔄 Continuous monitoring để xóa #dontfoid liên tục (TRONG iframe document)
  useEffect(() => {
    if (!adBlockEnabled || !videoSource) return
    
    // Chỉ cho loadvid và vevocloud
    const isLoadvid = videoSource?.includes('loadvid') || false
    const isVevocloud = videoSource?.includes('vevocloud') || false
    if (!isLoadvid && !isVevocloud) return

    const removeDontfoid = () => {
      // 🎯 1. XÓA TỪ DOCUMENT CHÍNH (phòng trường hợp nằm ngoài)
      const dontfoidMain = document.getElementById('dontfoid')
      if (dontfoidMain) {
        dontfoidMain.remove()
        console.log('🗑️ Removed #dontfoid from main document')
        setPopupBlocked(prev => prev + 1)
      }

      document.querySelectorAll('[id*="dontfoid"]').forEach(el => {
        if (el instanceof HTMLElement) {
          el.remove()
          setPopupBlocked(prev => prev + 1)
        }
      })

      // 🎯 2. XÓA TỪ TRONG IFRAME DOCUMENT
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          const iframeDoc = iframeRef.current.contentWindow.document
          
          // Xóa #dontfoid
          const dontfoidIframe = iframeDoc.getElementById('dontfoid')
          if (dontfoidIframe) {
            dontfoidIframe.remove()
            console.log('🗑️ Removed #dontfoid from IFRAME document')
            setPopupBlocked(prev => prev + 1)
          }

          // Xóa tất cả elements có id chứa "dontfoid"
          iframeDoc.querySelectorAll('[id*="dontfoid"]').forEach(el => {
            if (el instanceof HTMLElement) {
              el.remove()
              console.log('🗑️ Removed [id*="dontfoid"] from IFRAME')
              setPopupBlocked(prev => prev + 1)
            }
          })

          // Xóa các overlay có z-index max
          iframeDoc.querySelectorAll('[style*="z-index: 2147483647"]').forEach(el => {
            if (el instanceof HTMLElement) {
              el.remove()
              console.log('🗑️ Removed high z-index overlay from IFRAME')
              setPopupBlocked(prev => prev + 1)
            }
          })

          // Xóa các div fixed transparent (ad overlays)
          iframeDoc.querySelectorAll('div[style*="position: fixed"][style*="background-color: transparent"]').forEach(el => {
            if (el instanceof HTMLElement) {
              // Check nếu là overlay toàn màn hình
              const style = el.getAttribute('style') || ''
              if (style.includes('top: 0') || style.includes('left: 0') || style.includes('width:') && style.includes('height:')) {
                el.remove()
                console.log('🗑️ Removed transparent fixed overlay from IFRAME')
                setPopupBlocked(prev => prev + 1)
              }
            }
          })

        } catch {
          // CORS - không thể truy cập iframe content
          // Thử dùng MutationObserver trên parent
        }
      }
    }

    // Chạy ngay lập tức
    removeDontfoid()

    // Kiểm tra mỗi 50ms (rất nhanh để catch ngay khi inject)
    const intervalId = setInterval(removeDontfoid, 50)

    // Cleanup
    return () => clearInterval(intervalId)
  }, [adBlockEnabled, videoSource])

  const isLoadvid = videoSource?.includes('loadvid') || false
  const isVevocloud = videoSource?.includes('vevocloud') || false
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  // 🛡️ Layer 0: Content Security Policy (CSP)
  useEffect(() => {
    // Add CSP meta tag dynamically
    const cspMeta = document.createElement('meta')
    cspMeta.httpEquiv = 'Content-Security-Policy'
    cspMeta.content = "frame-ancestors 'self';"
    document.head.appendChild(cspMeta)

    return () => {
      // Cleanup
      if (cspMeta.parentNode) {
        cspMeta.parentNode.removeChild(cspMeta)
      }
    }
  }, [])

  // 🔍 Layer 1: Intersection Observer - Only block when player is visible
  useEffect(() => {
    if (!playerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsPlayerVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.5 } // Player at least 50% visible
    )

    observer.observe(playerRef.current)
    return () => observer.disconnect()
  }, [])

  // 🔥 Layer 2: AGGRESSIVE Block all navigation/redirects (Mobile + Desktop)
  useEffect(() => {
    if (!adBlockEnabled || !isPlayerVisible) return
    if (!isLoadvid && !isVevocloud) return // Only for suspicious servers

    const currentUrl = window.location.href
    let redirectBlocked = false

    // 1. Override history methods to block pushState/replaceState redirects
    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    history.pushState = function(...args) {
      const url = args[2]
      if (url && url.toString() !== currentUrl && !url.toString().includes(window.location.host)) {
        console.log('🛡️ [MOBILE] Blocked pushState redirect:', url)
        setPopupBlocked(prev => prev + 1)
        return
      }
      return originalPushState.apply(this, args)
    }

    history.replaceState = function(...args) {
      const url = args[2]
      if (url && url.toString() !== currentUrl && !url.toString().includes(window.location.host)) {
        console.log('🛡️ [MOBILE] Blocked replaceState redirect:', url)
        setPopupBlocked(prev => prev + 1)
        return
      }
      return originalReplaceState.apply(this, args)
    }

    // 2. Monitor popstate for back/forward manipulation
    const handlePopState = (e: PopStateEvent) => {
      if (window.location.href !== currentUrl) {
        console.log('🛡️ [MOBILE] Detected navigation, restoring URL')
        e.preventDefault()
        setPopupBlocked(prev => prev + 1)
        // Push back to current URL
        history.pushState(null, '', currentUrl)
      }
    }

    // 3. Block hashchange redirects
    const handleHashChange = (e: HashChangeEvent) => {
      if (!e.newURL.includes(window.location.host)) {
        console.log('🛡️ [MOBILE] Blocked hash redirect:', e.newURL)
        e.preventDefault()
        setPopupBlocked(prev => prev + 1)
        window.location.hash = ''
      }
    }

    // 4. Aggressive touch blocking for mobile links
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link) {
        const href = link.getAttribute('href')
        const target_attr = link.getAttribute('target')
        
        // Block external links and _blank links
        if (href && (
          target_attr === '_blank' ||
          !href.startsWith(window.location.origin) && !href.startsWith('/') && !href.startsWith('#')
        )) {
          e.preventDefault()
          e.stopPropagation()
          setPopupBlocked(prev => prev + 1)
          console.log('🛡️ [MOBILE] Blocked touch on external link:', href)
        }
      }
    }

    // 5. Override window.location methods
    try {
      const originalAssign = window.location.assign.bind(window.location)
      const originalReplace = window.location.replace.bind(window.location)

      window.location.assign = function(url: string) {
        if (!url.includes(window.location.host)) {
          console.log('🛡️ [MOBILE] Blocked location.assign:', url)
          setPopupBlocked(prev => prev + 1)
          return
        }
        return originalAssign(url)
      }

      window.location.replace = function(url: string) {
        if (!url.includes(window.location.host)) {
          console.log('🛡️ [MOBILE] Blocked location.replace:', url)
          setPopupBlocked(prev => prev + 1)
          return
        }
        return originalReplace(url)
      }
    } catch {
      console.log('Cannot override location methods')
    }

    // 6. Block by modifying href setter (modern approach)
    try {
      const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
      if (locationDescriptor && locationDescriptor.configurable !== false) {
        let internalHref = window.location.href
        
        Object.defineProperty(window.location, 'href', {
          get: () => internalHref,
          set: (value: string) => {
            if (!value.includes(window.location.host) && !redirectBlocked) {
              redirectBlocked = true
              console.log('🛡️ [MOBILE] Blocked href redirect:', value)
              setPopupBlocked(prev => prev + 1)
              
              // Reset after 1 second
              setTimeout(() => { redirectBlocked = false }, 1000)
              return
            }
            internalHref = value
            window.location.replace(value)
          },
          configurable: true
        })
      }
    } catch {
      console.log('Cannot redefine location.href')
    }

    window.addEventListener('popstate', handlePopState, true)
    window.addEventListener('hashchange', handleHashChange, true)
    document.addEventListener('touchstart', handleTouchStart, { capture: true, passive: false })

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [adBlockEnabled, isPlayerVisible, isLoadvid, isVevocloud])

  // 🔥 Layer 3: Main Popup Blocking - RAF Focus Loop
  useEffect(() => {
    if (!adBlockEnabled || !isPlayerVisible) return // Only active when visible!

    let isComponentMounted = true
    
    // ⚡ Initialize interaction time to NOW - Block from start!
    lastInteractionRef.current = Date.now()

    // 1. AGGRESSIVE window.open override - ALWAYS block, count it
    const originalWindowOpen = window.open
    window.open = function (...args) {
      console.log('🛡️ [INNER] BLOCKED window.open:', args[0])
      setPopupBlocked(prev => prev + 1)
      // Multiple focus attempts
      window.focus()
      requestAnimationFrame(() => window.focus())
      setTimeout(() => window.focus(), 0)
      setTimeout(() => window.focus(), 10)
      return null // NEVER allow
    }

    // 2. 🚀 AGGRESSIVE RAF Focus Loop - ALWAYS monitor
    const focusLoop = () => {
      if (!isComponentMounted) return
      
      // ALWAYS check focus (no time limit!)
      if (document.hidden || !document.hasFocus()) {
        setPopupBlocked(prev => prev + 1)
        
        // Desktop: window.focus() works
        if (!isMobile) {
          window.focus()
        } else {
          // Mobile: Try alternative methods
          try {
            window.scrollTo(window.scrollX, window.scrollY)
            if (document.body) {
              document.body.focus()
            }
            window.dispatchEvent(new Event('focus'))
          } catch {
            // Ignore errors
          }
        }
      }
      
      rafRef.current = requestAnimationFrame(focusLoop)
    }
    rafRef.current = requestAnimationFrame(focusLoop)

    // 3. AGGRESSIVE blur detection - ALWAYS block
    const handleBlur = (e: FocusEvent) => {
      console.log('🛡️ [INNER] Detected blur, focusing back')
      e.preventDefault()
      e.stopPropagation()
      setPopupBlocked(prev => prev + 1)
      
      // Multiple focus attempts
      window.focus()
      requestAnimationFrame(() => window.focus())
      setTimeout(() => window.focus(), 0)
      setTimeout(() => window.focus(), 10)
      setTimeout(() => window.focus(), 20)
      setTimeout(() => window.focus(), 50)
    }

    // 4. AGGRESSIVE visibility change - ALWAYS block
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🛡️ [INNER] Page hidden, restoring')
        setPopupBlocked(prev => prev + 1)
        
        // Multiple focus attempts
        requestAnimationFrame(() => window.focus())
        setTimeout(() => window.focus(), 0)
        setTimeout(() => window.focus(), 50)
        setTimeout(() => window.focus(), 100)
        setTimeout(() => window.focus(), 200)
      }
    }

    // 5. AGGRESSIVE beforeunload - ALWAYS block
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('🛡️ [INNER] Blocked beforeunload')
      e.preventDefault()
      e.returnValue = ''
      setPopupBlocked(prev => prev + 1)
      return ''
    }

    // 6. AGGRESSIVE click blocking - ALWAYS check
    const blockClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for links
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a')
        if (link && (link as HTMLAnchorElement).target === '_blank') {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          setPopupBlocked(prev => prev + 1)
          console.log('🛡️ [INNER] BLOCKED target="_blank" link')
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
  }, [videoSource, adBlockEnabled, isPlayerVisible])


  // Reset popup counter và click eater khi đổi video
  useEffect(() => {
    setPopupBlocked(0)
    setEatenClicks(0)
    
    // Delay click eater activation để cho autoplay trigger trước
    setClickEaterActive(false)
    
    const delayTimer = setTimeout(() => {
      setClickEaterActive(true)
      console.log('🥷 [SILENT] Click eater activated after autoplay delay')
    }, 2000) // 2 giây delay
    
    return () => clearTimeout(delayTimer)
  }, [videoSource])

  // Determine required clicks based on server (more clicks for mobile)
  const requiredClicks = isLoadvid 
    ? (isMobile ? 5 : 3) 
    : (isVevocloud 
        ? (isMobile ? 4 : 2) 
        : 0)

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
            sandbox={"allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"}
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

        {/* Silent Ad Block Status - Subtle */}
        {adBlockEnabled && showAdBlockStatus && (
          <div className="absolute top-2 left-2 bg-green-600/80 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 opacity-0 animate-fade-in">
            <Shield className="h-2.5 w-2.5" />
            <span>Protected</span>
          </div>
        )}

        {/* 🥷 INVISIBLE Click Eater - Eats first clicks/taps silently */}
        {clickEaterActive && videoSource && requiredClicks > 0 && (
          <div
            className="absolute inset-0 z-40 cursor-pointer"
            style={{ 
              pointerEvents: eatenClicks < requiredClicks ? 'auto' : 'none',
              background: 'transparent', // Completely invisible
              touchAction: 'manipulation' // Prevent double-tap zoom, etc.
            }}
            // Block all mouse events
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              
              const newCount = eatenClicks + 1
              setEatenClicks(newCount)
              setPopupBlocked(prev => prev + 1)
              
              console.log(`🥷 [SILENT] Ate click ${newCount}/${requiredClicks}`)
              
              if (newCount >= requiredClicks) {
                console.log('🥷 [SILENT] Click eater deactivated, video accessible')
                setClickEaterActive(false)
              }
              
              lastInteractionRef.current = Date.now()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onMouseUp={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            // Block all touch events for mobile
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              
              // Eat on touch START to prevent any propagation
              const newCount = eatenClicks + 1
              setEatenClicks(newCount)
              setPopupBlocked(prev => prev + 1)
              
              console.log(`🥷 [MOBILE] Ate touch ${newCount}/${requiredClicks}`)
              
              if (newCount >= requiredClicks) {
                console.log('🥷 [MOBILE] Click eater deactivated, video accessible')
                setClickEaterActive(false)
              }
              
              lastInteractionRef.current = Date.now()
            }}
            onTouchMove={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onTouchCancel={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            // Block pointer events (covers both mouse and touch)
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          />
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

        {/* Report & Stats */}
        <div className="flex items-center gap-2">
          {/* Subtle Popup Counter */}
          {popupBlocked > 0 && (
            <div className="flex items-center gap-1 bg-green-600/90 text-white text-xs px-2 py-1 rounded">
              <Shield className="h-3 w-3" />
              <span className="font-medium">{popupBlocked}</span>
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