"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EpisodeList } from "@/app/xem-phim/components/episode-list";
import { EpisodeInfo } from "@/app/xem-phim/components/episode-info";
import { EpisodeNavigation } from "@/app/xem-phim/components/episode-navigation";
import { CommentsSection } from "@/app/xem-phim/components/comments-section";
import { VideoPlayer } from "@/components/video-player";
import { Wrapper } from "@/components/wrapper";
import MVLink from "@/components/Link";
import { ANIME_PATHS } from "@/constant/path.constant";
import { SOCIAL_LINKS } from "@/constant/social.constant";
import { useHistoryStore } from "@/store/history";
import { Switch } from "@/components/ui/switch";
import NominatedFilmSidebar from "@/app/phim/_components/NominatedFilm";
import "./style.css";
import { SwitchEpisode } from "../components/switch-episode";
import { EpisodeDescriptions } from "../components/episode-descriptions";
import { AnimeResponse } from "@/services/api/anime.api";

interface Product {
  _id: string;
  seri: string;
  isApproved: boolean;
  view: number;
  slug: string;
}

interface Comment {
  user: string;
  content: string;
  rating: number;
  date: string;
}

export interface CombiningEpisode {
  _id: string;
  name: string;
  slug: string;
  episodesName: string;
  link1: string;
}
interface Tag {
  _id: string;
  name: string;
}
export interface Category {
  _id: string;
  name: string;
  slug: string;
  des: string;
  type: string;
  isMovie: string;
  year: string;
  time: string;
  lang: string;
  quality: string;
  thumbnail?: string;
  linkImg?: string;
  products: Product[];
  combiningEpisodes: CombiningEpisode[];
  status: string;
  sumSeri: string;
  tags: Tag[];
}

export interface Anime {
  name: string;
  slug: string;
  seri: string;
  isApproved: boolean;
  view: number;
  category: Category;
  copyright: string;
  comment: Comment[];
  zaloGroupLink?: string;
  createdAt: string;
  prevEpisode: string;
  nextEpisode: string;
}


export function WatchClient({ anime, topCategory }: { anime: Anime, topCategory: AnimeResponse[] }) {
  const [isCompactEpisodes, setIsCompactEpisodes] = useState(true);
  const addToHistory = useHistoryStore((state) => state.addToHistory);
  const desktopEpisodeListRef = useRef<HTMLDivElement>(null);
  const mobileEpisodeListRef = useRef<HTMLDivElement>(null);
  const currentEpisodeRef = useRef<HTMLDivElement>(null);
  const currentMobileEpisodeRef = useRef<HTMLDivElement>(null);
  const [combiningEpisodes, setCombiningEpisodes] = useState<CombiningEpisode | null>(null);


  // Thêm useEffect để cập nhật lịch sử xem
  useEffect(() => {
    addToHistory({
      id: anime.category._id,
      name: anime.name,
      slug: anime.slug,
      thumbnail: anime.category.linkImg || '',
      currentEpisode: anime.seri,
      lastWatched: Date.now(),
    });
  }, [anime, addToHistory]);

  // Thêm useEffect để scroll đến tập đang xem
  useEffect(() => {
    // Scroll cho desktop view
    if (currentEpisodeRef.current && desktopEpisodeListRef.current) {
      const container = desktopEpisodeListRef.current;
      const element = currentEpisodeRef.current;

      const elementTop = element.offsetTop;
      const containerTop = container.offsetTop;
      const scrollPosition = elementTop - containerTop - (container.clientHeight / 2) + (element.clientHeight / 2);

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }

    // Scroll cho mobile view
    if (currentMobileEpisodeRef.current && mobileEpisodeListRef.current) {
      const container = mobileEpisodeListRef.current;
      const element = currentMobileEpisodeRef.current;

      const elementTop = element.offsetTop;
      const containerTop = container.offsetTop;
      const scrollPosition = elementTop - containerTop - (container.clientHeight / 2) + (element.clientHeight / 2);

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [anime.seri]);


  const currentEpisode = anime.category.products[0];
  const zaloLink = anime.zaloGroupLink || SOCIAL_LINKS.ZALO;

  return (
    <div className="min-h-screen bg-background">
      <Wrapper>
        <div className="flex items-center gap-2 mb-4">
          <MVLink href={`${ANIME_PATHS.BASE}/${anime.category.slug}`} >
            <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Trở về Chi tiết
            </Button>
          </MVLink>
        </div>

        <div className="container mx-auto py-6 space-y-6 md:space-y-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="w-full lg:w-3/4">
              <div className="rounded-lg overflow-hidden">
                <VideoPlayer episode={currentEpisode} anime={anime} combiningEpisodes={combiningEpisodes} />

                <div className="block md:hidden mt-4 rounded-lg p-4">
                  {/* Mobile Episode Info */}
                  <EpisodeInfo
                    name={anime.name}
                    seri={anime.seri}
                    isMovie={anime.category?.isMovie}
                    createdAt={anime.createdAt}
                    time={anime.category.time}
                    titleSize="text-xl"
                  />

                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Danh sách tập</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Rút gọn</span>
                      <Switch
                        checked={isCompactEpisodes}
                        onCheckedChange={setIsCompactEpisodes}
                        className="data-[state=checked]:bg-[#FFD875]"
                      />
                    </div>
                  </div>
                  <EpisodeNavigation
                    prevEpisode={anime.prevEpisode}
                    nextEpisode={anime.nextEpisode}
                  />

                  <Tabs defaultValue="list" className="w-full">
                    {anime.category.combiningEpisodes?.length > 0 && (
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="list" className="flex-1">Danh sách tập</TabsTrigger>
                        <TabsTrigger value="grouped" className="flex-1">Tập đã gộp</TabsTrigger>
                      </TabsList>
                    )}

                    <TabsContent value="list" className="mt-0">
                      <EpisodeList
                        products={anime.category.products}
                        currentSeri={anime.seri}
                        isMovie={anime.category.isMovie}
                        isCompactEpisodes={isCompactEpisodes}
                        setIsCompactEpisodes={setIsCompactEpisodes}
                        episodeListRef={mobileEpisodeListRef}
                        currentEpisodeRef={currentMobileEpisodeRef}
                        showSwitch={false}
                        height={isCompactEpisodes ? "h-[200px]" : "h-[500px]"}
                        columns={{
                          compact: "grid-cols-3",
                          compactThumbnail: "grid-cols-2",
                          normal: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6"
                        }}
                        textEpisode="Tập"
                      />
                    </TabsContent>

                    {anime.category.combiningEpisodes?.length > 0 && (
                      <TabsContent value="grouped" className="mt-0">
                        <div className="h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50">
                          <div className="grid grid-cols-3 gap-2">
                            {anime.category.combiningEpisodes.map((product: CombiningEpisode, index) => (
                              <button
                                key={index}
                                className={`flex items-center justify-center w-full h-10 rounded-md border transition-all duration-200 text-sm font-medium ${combiningEpisodes?.episodesName === product.episodesName
                                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                  : 'bg-background hover:bg-muted border-border hover:border-primary/50 hover:shadow-sm'
                                  }`}
                                onClick={() => setCombiningEpisodes(product)}
                              >
                                {product.episodesName}
                              </button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </div>
              <div>
                {/* Desktop Episode Info - Hidden on mobile */}
                <div className="hidden md:block">
                  <EpisodeInfo
                    name={anime.name}
                    seri={anime.seri}
                    isMovie={anime.category?.isMovie}
                    createdAt={anime.createdAt}
                    time={anime.category.time}
                    titleSize="text-2xl"
                    className="mt-8"
                  />
                </div>
                <EpisodeDescriptions episode={anime} />
                  <CommentsSection
                    comments={anime.comment || []}
                    zaloLink={zaloLink}
                  />
              </div>
            </div>
            <div className="hidden md:block w-full lg:w-1/4 space-y-6">
              <div className="bg-card rounded-lg shadow-sm p-4">
                <div className="mb-4">
                  <SwitchEpisode isCompactEpisodes={isCompactEpisodes} setIsCompactEpisodes={setIsCompactEpisodes} />
                  <EpisodeNavigation
                    prevEpisode={anime.prevEpisode}
                    nextEpisode={anime.nextEpisode}
                    className="mt-4"
                  />
                </div>

                <Tabs defaultValue="list" className="w-full">
                  {anime.category.combiningEpisodes?.length > 0 && (
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="list" className="flex-1">Danh sách tập</TabsTrigger>
                      <TabsTrigger value="grouped" className="flex-1">Tập đã gộp</TabsTrigger>
                    </TabsList>
                  )}

                  <TabsContent value="list" className="mt-0">
                    <EpisodeList
                      products={anime.category.products}
                      currentSeri={anime.seri}
                      isMovie={anime.category.isMovie}
                      isCompactEpisodes={isCompactEpisodes}
                      setIsCompactEpisodes={setIsCompactEpisodes}
                      episodeListRef={desktopEpisodeListRef}
                      currentEpisodeRef={currentEpisodeRef}
                      showSwitch={false}
                      height="h-[500px]"
                      columns={{
                        compact: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8",
                        normal: "grid-cols-4",
                        compactThumbnail: "grid-cols-2"
                      }}
                      textEpisode=""
                    />
                  </TabsContent>

                  {anime.category.combiningEpisodes?.length > 0 && (
                    <TabsContent value="grouped" className="mt-0">
                      <div className="h-[500px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50">
                        <div className="grid grid-cols-4 gap-2">
                          {anime.category.combiningEpisodes.map((product: CombiningEpisode, index) => (
                            <button
                              key={index}
                              className={`flex items-center justify-center w-full h-10 rounded-md border transition-all duration-200 text-sm font-medium ${combiningEpisodes?.episodesName === product.episodesName
                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                : 'bg-background hover:bg-muted border-border hover:border-primary/50 hover:shadow-sm'
                                }`}
                              onClick={() => setCombiningEpisodes(product)}
                            >
                              {product.episodesName}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
              <NominatedFilmSidebar topCategory={topCategory} />
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}