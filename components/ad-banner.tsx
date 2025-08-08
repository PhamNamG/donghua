"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdBannerProps {
	position: "header" | "sidebar" | "content" | "footer" | "popup" | "video-overlay" | "between-content" | "bottom"
	size?: "small" | "medium" | "large" | "banner" | "square" | "video"
	className?: string
	closeable?: boolean
	autoClose?: number
	priority?: "high" | "medium" | "low"
	onClose?: () => void
}

interface AdData {
	title: string
	description: string
	image: string
	link: string
	cta: string
}

// Mock ad data - in real app, this would come from an ad server
const adData: Record<string, AdData> = {
	header: {
		title: "",
		description: "",
		image: "",
		link: "",
		cta: "",
	},
	sidebar: {
		title: "Game Mobile Hot",
		description: "Tải ngay game RPG hấp dẫn nhất 2025",
		image: "/placeholder.svg?height=250&width=300",
		link: "#",
		cta: "Tải game",
	},
	content: {
		title: "Thời trang Anime",
		description: "Bộ sưu tập áo thun anime độc đáo",
		image: "/placeholder.svg?height=200&width=600",
		link: "#",
		cta: "Mua ngay",
	},
	footer: {
		title: "Ứng dụng di động",
		description: "Tải app AnimeWorld để xem mọi lúc mọi nơi",
		image: "/placeholder.svg?height=100&width=320",
		link: "#",
		cta: "Tải app",
	},
	popup: {
		title: "Ưu đãi có thời hạn!",
		description: "Giảm 50% gói Premium trong 24h",
		image: "/placeholder.svg?height=300&width=400",
		link: "/premium",
		cta: "Nhận ưu đãi",
	},
	video: {
		title: "Sponsor",
		description: "Nhà tài trợ chính thức",
		image: "/placeholder.svg?height=60&width=200",
		link: "#",
		cta: "Tìm hiểu thêm",
	},
	bottom: {
		title: "",
		description: "",
		image: "",
		link: "",
		cta: "",
	},
	"video-overlay": {
		title: "Quảng cáo video",
		description: "Xem video không quảng cáo với Premium",
		image: "/placeholder.svg?height=60&width=200",
		link: "/premium",
		cta: "Nâng cấp ngay",
	},
}

// Helper function to check if ad data exists and is valid
const isValidAdData = (ad: AdData | undefined): ad is AdData => {
	return Boolean(ad && ad.title && ad.description && ad.image && ad.link && ad.cta)
}

export function AdBanner({
	position,
	size = "medium",
	className = "",
	closeable = false,
	autoClose,
	onClose,
}: AdBannerProps) {
	const [isVisible, setIsVisible] = useState(true)
	const [isLoaded, setIsLoaded] = useState(false)

	const ad = adData[position as keyof typeof adData]

	useEffect(() => {
		if (autoClose && autoClose > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false)
				onClose?.()
			}, autoClose * 1000)
			return () => clearTimeout(timer)
		}
	}, [autoClose, onClose])

	// Simulate ad loading
	useEffect(() => {
		const loadTimer = setTimeout(() => {
			setIsLoaded(true)
		}, 500)
		return () => clearTimeout(loadTimer)
	}, [])

	const handleClose = () => {
		setIsVisible(false)
		onClose?.()
	}

	if (!isValidAdData(ad)) {
		return null
	}

	if (!isVisible) return null

	const sizeClasses = {
		small: "h-20 w-full max-w-sm",
		medium: "h-32 w-full max-w-md",
		large: "h-48 w-full max-w-lg",
		banner: "h-24 w-full max-w-4xl",
		square: "h-64 w-64",
		video: "h-16 w-full max-w-xs",
	}

	const positionClasses = {
		header:
			"bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800",
		sidebar:
			"bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800",
		content:
			"bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800",
		footer:
			"bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800",
		popup:
			"bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border border-yellow-200 dark:border-yellow-800 shadow-2xl",
		"video-overlay": "bg-black/80 backdrop-blur-sm border border-white/20",
		"between-content":
			"bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border border-slate-200 dark:border-slate-800",
		bottom:
			"fixed bottom-0 left-0 right-0 z-50",
	}

	if (!isLoaded) {
		return (
			<div className={`${sizeClasses[size]} ${className} animate-pulse`}>
				<div className="bg-muted rounded-lg h-full flex items-center justify-center">
					<div className="text-sm text-muted-foreground">Đang tải quảng cáo...</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`
      ${sizeClasses[size]} 
      ${positionClasses[position]} 
      ${className}
      relative overflow-hidden group hover:shadow-lg transition-all duration-300
    `}
		>
			{closeable && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 h-6 w-6 opacity-60 hover:opacity-100 z-10"
					onClick={handleClose}
				>
					<X className="h-4 w-4" />
				</Button>
			)}

			<a
				href={ad.link}
				className="block h-full w-full hover:scale-[1.02] transition-transform duration-300"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					src={ad.image || "/placeholder.svg"}
					className="w-full h-full object-cover rounded-lg"
				/>
			</a>
		</div>
	)
}

// Popup Ad Component
// export function PopupAd() {
// 	const [isVisible, setIsVisible] = useState(false)

// 	// Check if popup ad data exists
// 	if (!isValidAdData(adData.popup)) {
// 		return null
// 	}

// 	useEffect(() => {
// 		const timer = setTimeout(() => {
// 			setIsVisible(true)
// 		}, 3000)
// 		return () => clearTimeout(timer)
// 	}, [])

// 	const handleClose = () => {
// 		setIsVisible(false)
// 	}

// 	if (!isVisible) return null

// 	return (
// 		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// 			<div className="relative max-w-md w-full">
// 				<AdBanner
// 					position="popup"
// 					size="large"
// 					closeable
// 					autoClose={10}
// 					priority="high"
// 					className="w-full"
// 					onClose={handleClose}
// 				/>
// 			</div>
// 		</div>
// 	)
// }

export function VideoOverlayAd({ onClose }: { onClose?: () => void }) {
	// Check if video overlay ad data exists
	if (!isValidAdData(adData["video-overlay"])) {
		return null
	}

	return (
		<div className="absolute top-4 right-4 z-10">
			<AdBanner position="video-overlay" size="video" closeable className="bg-black/80 text-white" onClose={onClose} />
		</div>
	)
}

export function BottomBanner() {
	const [isVisible, setIsVisible] = useState(true)

	if (!isValidAdData(adData.bottom)) {
		return null
	}

	const handleClose = () => {
		setIsVisible(false)
	}

	if (!isVisible) return null

	return (
		<AdBanner
			position="bottom"
			size="banner"
			closeable
			className="z-50 !h-[80px] px-4 shadow-lg"
			onClose={handleClose}
		/>
	)
}

// Component hiển thị khi không có quảng cáo
export function NoAdBanner({
	position = "content",
	size = "medium",
	className = "",
	closeable = false,
	onClose,
}: {
	position?: "header" | "sidebar" | "content" | "footer" | "popup" | "video-overlay" | "between-content" | "bottom"
	size?: "small" | "medium" | "large" | "banner" | "square" | "video"
	className?: string
	closeable?: boolean
	onClose?: () => void
}) {
	const [isVisible, setIsVisible] = useState(true)
	
	const sizeClasses = {
		small: "h-20 w-full max-w-sm",
		medium: "h-32 w-full max-w-md",
		large: "h-48 w-full max-w-lg",
		banner: "h-24 w-full max-w-4xl",
		square: "h-64 w-64",
		video: "h-16 w-full max-w-xs",
	}

	const positionClasses = {
		header:
			"bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800",
		sidebar:
			"bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800",
		content:
			"bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800",
		footer:
			"bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800",
		popup:
			"bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border border-yellow-200 dark:border-yellow-800 shadow-2xl",
		"video-overlay": "bg-black/80 backdrop-blur-sm border border-white/20",
		"between-content":
			"bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border border-slate-200 dark:border-slate-800",
		bottom:
			"fixed bottom-0 left-0 right-0 z-50",
	}

	const funnyMessages = "🎭 Ngào quá, nên quảng cáo gì đây..."

	const handleClose = () => {
		setIsVisible(false)
		onClose?.()
	}

	if (!isVisible) return null

	return (
		<div
			className={`
				${sizeClasses[size]} 
				${positionClasses[position]} 
				${className}
				relative overflow-hidden group hover:shadow-lg transition-all duration-300
				flex items-center justify-center p-4
				bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900
				border-2 border-dashed border-blue-300 dark:border-blue-600
				rounded-xl shadow-md
			`}
		>
			{closeable && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 h-6 w-6 opacity-60 hover:opacity-100 z-10"
					onClick={handleClose}
				>
					<X className="h-4 w-4" />
				</Button>
			)}

			<div className="flex items-center gap-4 text-center w-full h-full p-4">
								{/* Logo */}
				<div className="flex-shrink-0">
					<div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg border-2 border-blue-200 dark:border-blue-700">
						<img 
							src="/images/b32705f7-9444-41f9-8457-d1cc7773a259-min.png" 
							alt="Logo" 
							className="w-full h-full object-contain"
						/>
					</div>
				</div>
				
				{/* Text */}
				<div className="flex-1">
					<p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
						{funnyMessages}
					</p>
				</div>
			</div>
			
		</div>
	)
}

// Component để kiểm tra và hiển thị quảng cáo hoặc NoAdBanner
export function SmartAdBanner({
	position,
	size = "medium",
	className = "",
	closeable = false,
	autoClose,
	priority = "medium",
	onClose,
	showNoAdFallback = true,
}: AdBannerProps & { showNoAdFallback?: boolean }) {
	const ad = adData[position as keyof typeof adData]

	// Nếu không có quảng cáo và được phép hiển thị fallback
	if (!isValidAdData(ad) && showNoAdFallback) {
		return (
			<NoAdBanner
				position={position}
				size={size}
				className={className}
				closeable={closeable}
				onClose={onClose}
			/>
		)
	}

	// Nếu có quảng cáo hoặc không hiển thị fallback
	return (
		<AdBanner
			position={position}
			size={size}
			className={className}
			closeable={closeable}
			autoClose={autoClose}
			priority={priority}
			onClose={onClose}
		/>
	)
}
