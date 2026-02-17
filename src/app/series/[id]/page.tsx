"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Download,
  ArrowLeft,
  Tv,
  Calendar,
  Globe,
  Tag,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Content, Episode } from "@/types";

function ContentSlider({ title, items, type }: { title: string; items: Content[]; type: "movie" | "series" }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, [mounted, items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <div className="relative">
        {mounted && showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-black/70 p-2 flex items-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px]"
            >
              <Link href={`/${type}/${item._id || item.id}`}>
                <div className="relative rounded-lg overflow-hidden aspect-[2/3] transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group/card">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  
                  {type === "movie" ? (
                    item.movieData?.embedIframeLink && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    )
                  ) : (
                    item.seasons && item.seasons.length > 0 && item.seasons.some((s: any) => s.episodes?.some((e: any) => e.embedIframeLink)) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    )
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0">
                    <h4 className="font-bold text-white text-sm line-clamp-2">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.rating !== undefined && item.rating !== null && (
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          {Number(item.rating).toFixed(1)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{item.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {mounted && showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-black/70 p-2 flex items-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SeriesDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [series, setSeries] = useState<Content | null>(null);
  const [relatedSeries, setRelatedSeries] = useState<Content[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`/api/content/${id}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch series");
          return;
        }

        if (data.data.type === "movie") {
          window.location.href = `/movie/${id}`;
          return;
        }

        setSeries(data.data);
        if (data.data.seasons && data.data.seasons.length > 0) {
          setSelectedSeason(data.data.seasons[0].seasonNumber);
        }

        const [relatedSeriesRes, relatedMoviesRes] = await Promise.all([
          fetch(`/api/content?category=${encodeURIComponent(data.data.category)}&type=series&limit=12`),
          fetch(`/api/content?type=movie&limit=6`),
        ]);

        const seriesData = await relatedSeriesRes.json();
        const moviesData = await relatedMoviesRes.json();

        if (seriesData.success) {
          setRelatedSeries(seriesData.data.filter((s: Content) => s._id !== id));
        }
        if (moviesData.success) {
          setRelatedMovies(moviesData.data);
        }
      } catch (err) {
        setError("An error occurred while fetching the series");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeries();
    }
  }, [id]);

  const hasAnyEmbedLink =
    series?.seasons?.some((season) =>
      season.episodes.some((episode: Episode) => episode.embedIframeLink)
    ) ?? false;

  const currentSeason = series?.seasons?.find(s => s.seasonNumber === selectedSeason);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050608]" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#9CA3AF]">Loading series...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-2">
            {error || "Series not found"}
          </h1>
          <p className="text-[#9CA3AF] mb-6">
            The series you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const latestSeason = series.seasons?.length || 0;

  return (
    <div className="min-h-screen bg-[#050608]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050608]/80 backdrop-blur-xl border-b border-[#1F232D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#F9FAFB] hover:text-[#8B5CF6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        {series.backdrop && (
          <div className="absolute inset-0 h-[50vh] overflow-hidden">
            <img
              src={series.backdrop}
              alt={series.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/60 to-transparent" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[30vh] pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={series.poster}
                alt={series.title}
                className="w-48 sm:w-56 md:w-64 rounded-xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F9FAFB] mb-4">
                {series.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {series.rating !== undefined && series.rating !== null && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5C542]/10 text-[#F5C542] text-sm font-medium">
                    <Star className="w-4 h-4" />
                    {Number(series.rating).toFixed(1)}
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                  <Calendar className="w-4 h-4" />
                  {series.year}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                  <Globe className="w-4 h-4" />
                  {series.language}
                </span>
                {series.category && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm">
                    <Tag className="w-4 h-4" />
                    {series.category}
                  </span>
                )}
              </div>

              <p className="text-[#9CA3AF] text-lg mb-8 max-w-2xl">
                {series.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {hasAnyEmbedLink && (
                  <Link
                    href={`/series/watch/${series._id || series.id}`}
                    className="flex items-center gap-2 px-8 py-4 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#8B5CF6]/90 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons & Episodes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-6">Seasons & Episodes</h2>
        
        {/* Season Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-[#1F232D]">
          {series.seasons?.map((season) => (
            <button
              key={season.seasonNumber}
              onClick={() => setSelectedSeason(season.seasonNumber)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSeason === season.seasonNumber
                  ? "bg-[#8B5CF6] text-white"
                  : "bg-[#1F232D] text-[#9CA3AF] hover:bg-[#1F232D]/80 hover:text-white"
              }`}
            >
              Season {season.seasonNumber}
              <span className="ml-2 text-xs opacity-70">({season.episodes.length})</span>
            </button>
          ))}
        </div>

        {/* Current Season Episodes */}
        {currentSeason && (
          <div className="bg-[#0E1015] rounded-2xl p-6 border border-[#1F232D]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                <span className="text-white font-bold text-lg">{currentSeason.seasonNumber}</span>
              </div>
              <h3 className="text-xl font-bold text-[#F9FAFB]">
                Season {currentSeason.seasonNumber}
              </h3>
              <span className="text-sm text-[#9CA3AF] ml-auto">
                {currentSeason.episodes.length} episodes
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentSeason.episodes.map((episode: Episode) => (
                <motion.div
                  key={episode.episodeNumber}
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-[#050608] rounded-xl border border-[#1F232D] hover:border-[#8B5CF6]/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video bg-[#1F232D] relative overflow-hidden">
                    {series.poster && (
                      <img
                        src={series.poster}
                        alt={episode.episodeTitle || `Episode ${episode.episodeNumber}`}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {episode.embedIframeLink ? (
                        <Link
                          href={`/series/watch/${series._id || series.id}?season=${currentSeason.seasonNumber}&episode=${episode.episodeNumber}`}
                          className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110"
                        >
                          <Play className="w-5 h-5 text-white fill-white ml-1" />
                        </Link>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center opacity-50">
                          <Play className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs font-medium text-white">
                      EP {episode.episodeNumber}
                    </div>
                    {episode.quality && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/80 rounded text-xs font-medium text-white">
                        {episode.quality}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-[#F9FAFB] text-sm line-clamp-1 mb-1">
                      {episode.episodeTitle || `Episode ${episode.episodeNumber}`}
                    </h4>
                    <div className="flex items-center gap-2">
                      {episode.downloadLink && (
                        <a
                          href={episode.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#8B5CF6] transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Series */}
      {relatedSeries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ContentSlider
            title="Related Series"
            items={relatedSeries}
            type="series"
          />
        </div>
      )}

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ContentSlider
            title="Popular Movies"
            items={relatedMovies}
            type="movie"
          />
        </div>
      )}
    </div>
  );
}
