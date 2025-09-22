// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { 
//   Calendar, 
//   Clock, 
//   Play, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight,
//   CalendarDays,
//   TrendingUp,
//   Star,
//   Grid3X3,
//   List,
//   ArrowUpDown
// } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useSchedule } from "@/hooks/useSchedule"
// import type { AnimeContent, Tag } from "@/services/api/schedule.api"
// import MVLink from "@/components/Link"
// import { ANIME_PATHS } from "@/constant/path.constant"

// const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]
// const FULL_DAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]

// type ViewMode = "grid" | "list"
// type SortBy = "time" | "name" | "episode" | "popularity"

// export default function SchedulePage() {
//   const [selectedDay, setSelectedDay] = useState("Thứ 2")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedGenre, setSelectedGenre] = useState("all")
//   const [viewMode, setViewMode] = useState<ViewMode>("grid")
//   const [sortBy, setSortBy] = useState<SortBy>("time")
//   const [currentWeek, setCurrentWeek] = useState(0)
  
//   const { schedule, isLoading } = useSchedule(selectedDay)

//   const getTodayKey = () => {
//     const dayMap: Record<string, string> = {
//       "Thứ Hai": "Thứ 2",
//       "Thứ Ba": "Thứ 3", 
//       "Thứ Tư": "Thứ 4",
//       "Thứ Năm": "Thứ 5",
//       "Thứ Sáu": "Thứ 6",
//       "Thứ Bảy": "Thứ 7",
//       "Chủ Nhật": "Chủ nhật",
//     }
//     const currentDay = new Date().toLocaleDateString("vi-VN", { weekday: "long" })
//     return dayMap[currentDay] || "Thứ 2"
//   }

//   useEffect(() => {
//     setSelectedDay(getTodayKey())
//   }, [])

//   // Get unique genres from all anime
//   const allGenres = schedule?.content?.reduce((genres: string[], anime: AnimeContent) => {
//     anime.tags.forEach((tag: Tag) => {
//       if (!genres.includes(tag.name)) {
//         genres.push(tag.name)
//       }
//     })
//     return genres
//   }, []) || []

//   // Filter and sort anime
//   const filteredAndSortedAnime = schedule?.content
//     ?.filter((anime: AnimeContent) => {
//       const matchesSearch = anime.name.toLowerCase().includes(searchQuery.toLowerCase())
//       const matchesGenre = selectedGenre === "all" || anime.tags.some(tag => tag.name === selectedGenre)
//       return matchesSearch && matchesGenre
//     })
//     ?.sort((a: AnimeContent, b: AnimeContent) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name)
//         case "episode":
//           return (parseInt(b.products[0]?.seri || "0") - parseInt(a.products[0]?.seri || "0"))
//         case "time":
//           return a.time.localeCompare(b.time)
//         default:
//           return 0
//       }
//     }) || []

//   const getWeekDates = (weekOffset: number = 0) => {
//     const today = new Date()
//     const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)))
//     const dates = []
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek)
//       date.setDate(startOfWeek.getDate() + i)
//       dates.push(date)
//     }
    
//     return dates
//   }

//   const weekDates = getWeekDates(currentWeek)
//   const isCurrentWeek = currentWeek === 0
//   const todayKey = getTodayKey()

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-muted rounded w-64"></div>
//           <div className="h-4 bg-muted rounded w-32"></div>
//           <div className="grid grid-cols-7 gap-4">
//             {Array.from({ length: 7 }).map((_, i) => (
//               <div key={i} className="h-20 bg-muted rounded"></div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="h-32 bg-muted rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <CalendarDays className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold">Lịch Chiếu Phim</h1>
//                   <p className="text-sm text-muted-foreground">
//                     Theo dõi lịch phát sóng các bộ anime mới nhất
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Stats */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
//                 <TrendingUp className="h-4 w-4 text-green-500" />
//                 <div className="text-sm">
//                   <div className="font-medium">{filteredAndSortedAnime.length}</div>
//                   <div className="text-xs text-muted-foreground">Phim hôm nay</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
//                 <Star className="h-4 w-4 text-yellow-500" />
//                 <div className="text-sm">
//                   <div className="font-medium">{allGenres.length}</div>
//                   <div className="text-xs text-muted-foreground">Thể loại</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6 space-y-6">
//         {/* Week Navigation */}
//         <Card className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-primary" />
//               <h2 className="font-semibold">
//                 {isCurrentWeek ? "Tuần này" : `Tuần ${currentWeek > 0 ? `+${currentWeek}` : currentWeek}`}
//               </h2>
//               <span className="text-sm text-muted-foreground">
//                 ({weekDates[0].toLocaleDateString("vi-VN")} - {weekDates[6].toLocaleDateString("vi-VN")})
//               </span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentWeek(currentWeek - 1)}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               {!isCurrentWeek && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentWeek(0)}
//                 >
//                   Hôm nay
//                 </Button>
//               )}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentWeek(currentWeek + 1)}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Week Calendar */}
//           <div className="grid grid-cols-7 gap-2">
//             {DAYS.map((day, index) => {
//               const date = weekDates[index]
//               const isToday = isCurrentWeek && day === todayKey
//               const isSelected = selectedDay === day
              
//               return (
//                 <button
//                   key={day}
//                   onClick={() => setSelectedDay(day)}
//                   className={`p-3 rounded-lg text-center transition-all duration-200 ${
//                     isSelected 
//                       ? "bg-primary text-primary-foreground shadow-md" 
//                       : isToday 
//                         ? "bg-primary/10 text-primary border border-primary/20" 
//                         : "hover:bg-muted"
//                   }`}
//                 >
//                   <div className="text-xs font-medium">{day}</div>
//                   <div className="text-lg font-bold mt-1">
//                     {date.getDate()}
//                   </div>
//                   <div className="text-xs text-muted-foreground mt-1">
//                     Th {date.getMonth() + 1}
//                   </div>
//                   {isToday && (
//                     <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1" />
//                   )}
//                 </button>
//               )
//             })}
//           </div>
//         </Card>

//         {/* Filters & Controls */}
//         <Card className="p-4">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1 flex flex-col sm:flex-row gap-4">
//               {/* Search */}
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Tìm kiếm anime..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>

//               {/* Genre Filter */}
//               <Select value={selectedGenre} onValueChange={setSelectedGenre}>
//                 <SelectTrigger className="w-full sm:w-48">
//                   <SelectValue placeholder="Thể loại" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Tất cả thể loại</SelectItem>
//                   {allGenres.map((genre) => (
//                     <SelectItem key={genre} value={genre}>
//                       {genre}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Sort */}
//               <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
//                 <SelectTrigger className="w-full sm:w-40">
//                   <ArrowUpDown className="h-4 w-4 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="time">Thời gian</SelectItem>
//                   <SelectItem value="name">Tên A-Z</SelectItem>
//                   <SelectItem value="episode">Số tập</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* View Mode */}
//             <div className="flex items-center border rounded-lg p-1">
//               <Button
//                 variant={viewMode === "grid" ? "default" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("grid")}
//               >
//                 <Grid3X3 className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === "list" ? "default" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("list")}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </Card>

//         {/* Content */}
//         <Card className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-xl font-bold">
//                 {FULL_DAYS[DAYS.indexOf(selectedDay)]} - {weekDates[DAYS.indexOf(selectedDay)]?.toLocaleDateString("vi-VN")}
//               </h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {filteredAndSortedAnime.length} bộ phim được lên lịch
//               </p>
//             </div>
//           </div>

//           {filteredAndSortedAnime.length === 0 ? (
//             <div className="text-center py-12">
//               <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
//               <h3 className="text-lg font-medium mb-2">Không có phim nào</h3>
//               <p className="text-muted-foreground">
//                 {searchQuery || selectedGenre !== "all" 
//                   ? "Thử thay đổi bộ lọc để xem thêm kết quả"
//                   : "Không có phim nào được lên lịch cho ngày này"
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className={
//               viewMode === "grid" 
//                 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
//                 : "space-y-4"
//             }>
//               {filteredAndSortedAnime.map((anime: AnimeContent) => (
//                 <AnimeCard 
//                   key={anime._id} 
//                   anime={anime} 
//                   viewMode={viewMode}
//                 />
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   )
// }

// interface AnimeCardProps {
//   anime: AnimeContent
//   viewMode: ViewMode
// }

// function AnimeCard({ anime, viewMode }: AnimeCardProps) {
//   if (viewMode === "list") {
//     return (
//       <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card/50 hover:bg-card">
//         <MVLink href={ANIME_PATHS.BASE + "/" + anime.slug}>
//           <div className="flex gap-4 p-4">
//             {/* Thumbnail */}
//             <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
//               <Image
//                 src={anime.linkImg}
//                 alt={anime.name}
//                 fill
//                 className="object-cover transition-transform duration-300 group-hover:scale-110"
//               />
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
//                     {anime.name}
//                   </h4>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {anime.tags.length > 0 ? anime.tags.map((tag: Tag) => tag.name).join(', ') : 'Anime'}
//                   </p>
                  
//                   {/* Episode & Time */}
//                   <div className="flex items-center gap-4 mt-2">
//                     <div className="flex items-center gap-1.5">
//                       <Play className="h-4 w-4 text-primary" />
//                       <span className="text-sm font-medium">Tập {anime.products[0]?.seri || 1}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">{anime.time}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-1 max-w-xs">
//                   {anime.tags.slice(0, 3).map((tag: Tag) => (
//                     <Badge key={tag._id} variant="secondary" className="text-xs">
//                       {tag.name}
//                     </Badge>
//                   ))}
//                   {anime.tags.length > 3 && (
//                     <Badge variant="outline" className="text-xs">
//                       +{anime.tags.length - 3}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </MVLink>
//       </Card>
//     )
//   }

//   return (
//     <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-card/50 hover:bg-card hover:-translate-y-1">
//       <MVLink href={ANIME_PATHS.BASE + "/" + anime.slug}>
//         <div className="relative">
//           {/* Thumbnail */}
//           <div className="relative aspect-[3/4] bg-muted overflow-hidden">
//             <Image
//               src={anime.linkImg}
//               alt={anime.name}
//               fill
//               className="object-cover transition-transform duration-300 group-hover:scale-110"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
//             {/* Time Badge */}
//             <div className="absolute top-3 right-3">
//               <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm">
//                 {anime.time}
//               </Badge>
//             </div>

//             {/* Episode Badge */}
//             <div className="absolute bottom-3 left-3">
//               <Badge variant="secondary" className="bg-primary text-primary-foreground">
//                 <Play className="h-3 w-3 mr-1" />
//                 Tập {anime.products[0]?.seri || 1}
//               </Badge>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-4 space-y-3">
//             <div>
//               <h4 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
//                 {anime.name}
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
//                 {anime.tags.length > 0 ? anime.tags.map((tag: Tag) => tag.name).join(', ') : 'Anime'}
//               </p>
//             </div>

//             {/* Tags */}
//             <div className="flex flex-wrap gap-1">
//               {anime.tags.slice(0, 2).map((tag: Tag) => (
//                 <Badge 
//                   key={tag._id} 
//                   variant="secondary" 
//                   className="text-xs bg-muted/50 hover:bg-muted/80 transition-colors"
//                 >
//                   {tag.name}
//                 </Badge>
//               ))}
//               {anime.tags.length > 2 && (
//                 <Badge variant="outline" className="text-xs opacity-60">
//                   +{anime.tags.length - 2}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </MVLink>
//     </Card>
//   )
// }


export default function SchedulePage() {
  return (
    <div>
      <h1>Schedule Page</h1>
    </div>
  )
}