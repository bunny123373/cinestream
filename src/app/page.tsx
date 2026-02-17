"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, Search, Star, ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react";
import { Content } from "@/types";

const CATEGORIES = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Sci-Fi", "Anime"];

interface SliderProps {
  title: string;
  items: Content[];
  type: "movie" | "series";
}

function ContentSlider({ title, items, type }: SliderProps) {
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
      const scrollAmount = 400;
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

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white hover:text-[#F5C542] cursor-pointer transition-colors">{title}</h3>
      </div>
      
      <div className="relative">
        {mounted && showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-[#050608] to-transparent w-12 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px] lg:w-[260px]"
            >
              <Link href={`/${type}/${item._id || item.id}`}>
                <div className="relative rounded-md overflow-hidden aspect-[2/3] transition-all duration-300 group/card hover:scale-110 hover:rounded-md z-10 shadow-lg">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute inset-0 bg-[#F5C542] opacity-0 group-hover/card:opacity-10 transition-opacity duration-300" />
                  
                  {type === "movie" ? (
                    item.movieData?.embedIframeLink && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform scale-50 group-hover/card:scale-100">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    )
                  ) : (
                    item.seasons && item.seasons.length > 0 && item.seasons.some((s: any) => s.episodes?.some((e: any) => e.embedIframeLink)) && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform scale-50 group-hover/card:scale-100">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    )
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-4 group-hover/card:translate-y-0">
                    <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs">
                      {item.rating !== undefined && item.rating !== null && (
                        <span className="flex items-center gap-1 text-yellow-400 font-medium">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          {Number(item.rating).toFixed(1)}
                        </span>
                      )}
                      <span className="text-gray-300">{item.year}</span>
                      <span className="text-gray-400">{item.category}</span>
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
            className="absolute right-0 top-0 bottom-0 z-20 bg-gradient-to-l from-[#050608] to-transparent w-12 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heroContent, setHeroContent] = useState<Content | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [moviesRes, seriesRes, topRatedRes] = await Promise.all([
          fetch("/api/content"),
          fetch("/api/content?type=series"),
          fetch("/api/content?sort=rating&limit=20"),
        ]);

        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();
        const topRatedData = await topRatedRes.json();

        if (moviesData.success) {
          setMovies(moviesData.data);
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
          const index = dayOfYear % moviesData.data.length;
          setHeroContent(moviesData.data[index]);
        }
        if (seriesData.success) setSeries(seriesData.data);
        if (topRatedData.success) setTopRatedMovies(topRatedData.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredMovies = selectedCategory === "All" 
    ? movies 
    : movies.filter(m => m.category === selectedCategory);

  const groupedMovies = filteredMovies.reduce((acc, movie) => {
    if (!acc[movie.category]) {
      acc[movie.category] = [];
    }
    acc[movie.category].push(movie);
    return acc;
  }, {} as Record<string, Content[]>);

  const categoriesWithContent = Object.keys(groupedMovies).filter(
    cat => groupedMovies[cat].length > 0
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050608]" />
    );
  }

  return (
    <div className="min-h-screen bg-[#050608]" suppressHydrationWarning>
      {/* Netflix-style Hero Banner */}
      <section className="relative h-[85vh] min-h-[500px]">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          {heroContent?.backdrop ? (
            <img
              src={heroContent.backdrop}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : heroContent?.poster ? (
            <img
              src={heroContent.poster}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#050608]/20" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            {heroContent && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block px-3 py-1 bg-[#F5C542] text-[#050608] text-sm font-bold rounded mb-4">
                    {heroContent.category}
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                    {heroContent.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-4">
                    {heroContent.rating !== undefined && heroContent.rating !== null && (
                      <span className="flex items-center gap-1 text-yellow-400 font-medium">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        {Number(heroContent.rating).toFixed(1)}
                      </span>
                    )}
                    <span className="text-gray-300">{heroContent.year}</span>
                    {heroContent.duration && (
                      <span className="text-gray-300">{heroContent.duration}</span>
                    )}
                    <span className="px-2 py-0.5 border border-gray-500 text-gray-300 text-sm rounded">
                      {heroContent.language}
                    </span>
                  </div>

                  <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                    {heroContent.description}
                  </p>

                  <div className="flex items-center gap-4">
                    {heroContent.movieData?.embedIframeLink ? (
                      <Link
                        href={`/watch/${heroContent._id || heroContent.id}`}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                      >
                        <Play className="w-5 h-5 fill-black" />
                        Play Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 px-8 py-3 bg-gray-600 text-gray-400 font-bold rounded cursor-not-allowed"
                      >
                        <Play className="w-5 h-5" />
                        Coming Soon
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-600/80 text-white font-medium rounded hover:bg-gray-600 transition-colors">
                      <Info className="w-5 h-5" />
                      More Info
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        </section>

        {/* Content Sections */}
      <div className="relative -mt-32 z-10 pb-20">
        {/* Top Rated Section */}
        {!loading && topRatedMovies.length > 0 && (
          <div className="mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ContentSlider
              title="Top Rated"
              items={topRatedMovies}
              type="movie"
            />
          </div>
        )}

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide max-w-7xl mx-auto">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === category
                  ? "bg-[#F5C542] text-black"
                  : "bg-black/50 text-gray-300 hover:bg-black/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Content Row */}
        {loading ? (
          <div className="px-4 sm:px-6 lg:px-8 mb-12">
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px]">
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : categoriesWithContent.length > 0 ? (
          categoriesWithContent.map((category) => (
            <div key={category} className="mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <ContentSlider
                title={category}
                items={groupedMovies[category]}
                type="movie"
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20 px-4">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400">No content available</p>
          </div>
        )}

        {/* Series Section */}
        {!loading && series.length > 0 && (
          <div className="mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ContentSlider
              title="Popular Series"
              items={series}
              type="series"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1F232D]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-[#F5C542]" />
              <span className="text-xl font-bold text-white">
                Cine<span className="text-[#F5C542]">Stream</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 CineStream. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
