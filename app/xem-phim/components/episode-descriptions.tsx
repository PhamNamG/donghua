import { Anime } from "@/app/xem-phim/[slug]/watch-client";
import { Badge } from "@/components/ui/badge";


export function EpisodeDescriptions({ episode }: { episode: Anime }) {
  return (
    <div className="mb-6">
      <div className="p-4 rounded-lg border">
        <div className="flex flex-wrap gap-2 mb-2">
          {
            episode.category.tags?.map((tag) => (
              <Badge variant="secondary" key={tag._id}>{tag.name}</Badge>
            ))
          }
          {
            episode.copyright && episode.copyright !== 'false' &&
            <Badge
              variant="outline"
              className="text-yellow-600 bg-yellow-50"
            >
              {episode.copyright}
            </Badge>
          }
          {/* Status Badge với Animation */}
          {episode.category.status === 'pending' ? (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
            >
              <div className="flex items-center gap-1.5">
                {/* Animated broadcasting icon */}
                <div className="relative">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-xs font-medium">
                  Đang chiếu {episode.category.products[0].seri}/{episode.category.sumSeri}
                </span>
              </div>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <div className="flex items-center gap-1.5">
                {/* Completed checkmark */}
                <div className="w-2 h-2 bg-green-500 rounded-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs font-medium">
                  Hoàn thành
                </span>
              </div>
            </Badge>
          )}
        </div>

        <p className="mb-4">{episode.category.des}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div>Năm: {episode.category.year}</div>
          <div>Thời lượng: {episode.category.time}</div>
          <div>Ngôn ngữ: {episode.category.lang === 'ThuyetMinh-Vietsub'
            ? 'Thuyết minh + Vietsub'
            : episode.category.lang === 'ThuyetMinh'
              ? 'Thuyết minh'
              : 'Vietsub'
          }</div>
          <div>Chất lượng: {episode.category.quality}</div>

          {/* Thêm thông tin trạng thái chi tiết */}
          {episode.category.status === 'pending' && (
            <div className="flex items-center gap-1 text-blue-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Cập nhật: {episode.seri}/{episode.category.sumSeri} tập</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}