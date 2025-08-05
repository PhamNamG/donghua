import { AnimationCard } from "@/components/animation-card";
import { getCategoryNominated } from "@/services/anime.server";

interface NominatedFilmProp {
    seriesId: string;
    categoryId: string;
}

interface NominatedFilmDataProp {
    _id: string;
    name: string;
    anotherName: string;
    slug: string;
    linkImg: string;
    des: string;
    sumSeri: string;
    products: []
    type: string;
    year: string;
    time: string;
    quality: string;
    lang: string;
    isMovie: string;
    up: number;
}

export default async function NominatedFilm({ seriesId, categoryId }: NominatedFilmProp) {
    const data = await getCategoryNominated(seriesId, categoryId);
    
    if (!data?.data?.length) {
        return null;
    }

    // Lọc bỏ các anime trùng lặp với anime chính
    const uniqueAnimes = data.data.filter((anime: NominatedFilmDataProp, index: number, self: NominatedFilmDataProp[]) => 
        index === self.findIndex((a) => a._id === anime._id)
    );

    // Giới hạn số lượng anime hiển thị để tránh trùng lặp quá nhiều
    const limitedAnimes = uniqueAnimes.slice(0, 12);

    return (
        <section className="mt-12" aria-label="Phim liên quan">
            <h2 className="text-xl font-semibold mb-6">Phim Liên Quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                {limitedAnimes.map((anime: NominatedFilmDataProp) => (
                    <AnimationCard 
                        key={anime._id} 
                        anime={anime}
                        showBadge={true}
                    />
                ))}
            </div>
            {/* Thêm structured data cho danh sách phim liên quan */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Phim liên quan",
                        "description": "Danh sách các phim hoạt hình liên quan",
                        "numberOfItems": limitedAnimes.length,
                        "itemListElement": limitedAnimes.map((anime: NominatedFilmDataProp, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Movie",
                                "name": anime.name,
                                "alternateName": anime.anotherName,
                                "image": anime.linkImg,
                                "url": `https://hh3dtq.site/phim/${anime.slug}`,
                                "datePublished": anime.year,
                                "description": anime.des
                            }
                        }))
                    })
                }}
            />
        </section>
    );
}
