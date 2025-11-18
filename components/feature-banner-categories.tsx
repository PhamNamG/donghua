"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/free-mode"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useFeatureBanners } from "@/hooks/useFeatureBanners"
import MVImage from "./ui/image"
import MVLink from "./Link"
import { ANIME_PATHS } from "@/constant/path.constant"

export function FeatureBannerCategories() {
  const { data, isLoading, error } = useFeatureBanners()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (error || !data?.data || data.data.length === 0) {
    return null
  }

  // Filter only active banners and sort by order
  const activeCategories = data.data
    .filter(banner => banner.isActive)
    .sort((a, b) => a.order - b.order)

  if (activeCategories.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay, FreeMode]}
        spaceBetween={12}
        slidesPerView={2}
        freeMode={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        navigation={{
          nextEl: ".feature-category-button-next",
          prevEl: ".feature-category-button-prev"
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 16,
          },
        }}
        className="!pb-2"
      >
        {activeCategories.map((category) => (
          <SwiperSlide key={category._id}>
            <MVLink href={`${ANIME_PATHS.BASE}/${category.category.slug}`}>
              <div className="overflow-hidden h-full transition-all hover:scale-[1.02] duration-300 group">
                {/* Poster Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <MVImage
                    src={category.category.linkImg}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-110 duration-300 rounded-sm"
                    priority
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges on hover */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.category.quality && (
                      <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
                        {category.category.quality}
                      </Badge>
                    )}
                    {category.category.sumSeri && (
                      <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-6 py-2 sm:py-2.51.5 py-0.5">
                        {category.category.sumSeri} tập
                      </Badge>
                    )}
                  </div>

                  {/* Bottom Info on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Badge 
                      variant="outline" 
                      className="bg-black/50 text-white border-white/30 text-[9px] sm:text-[10px] backdrop-blur-sm"
                    >
                      {category.category.lang === "ThuyetMinh-Vietsub" 
                        ? "TM + VS" 
                        : category.category.lang === "ThuyetMinh" 
                          ? "Thuyết minh" 
                          : "Vietsub"}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <div className="py-2 sm:py-2.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      {category.category.anotherName && (
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1">
                          {category.category.anotherName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </MVLink>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {activeCategories.length > 5 && (
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="feature-category-button-prev bg-background/90 absolute -left-4 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm transition-all duration-300 hover:scale-110 h-8 w-8 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="feature-category-button-next bg-background/90 absolute -right-4 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm transition-all duration-300 hover:scale-110 h-8 w-8 shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

