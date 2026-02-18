"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Film, Tv, Menu, X } from "lucide-react";
import { Content } from "@/types";
import PrimeVideoHeroBanner from "@/components/PrimeVideoHeroBanner";
import PrimeVideoContentRow from "@/components/PrimeVideoContentRow";

const CATEGORIES = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Sci-Fi", "Anime"];

export default function HomePage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Content[]>([]);
  const [tmdbTrending, setTmdbTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heroContent, setHeroContent] = useState<Content | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [moviesRes, seriesRes, trendingRes] = await Promise.all([
          fetch("/api/content?type=movie"),
          fetch("/api/content?type=series"),
          fetch("/api/tmdb?list=trending&type=movie"),
        ]);

        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();
        const trendingData = await trendingRes.json();

        if (moviesData.success) {
          setMovies(moviesData.data);
          if (moviesData.data.length > 0) {
            setHeroContent(moviesData.data[0]);
          }
        }
        if (seriesData.success) setSeries(seriesData.data);
        
        if (trendingData.success && trendingData.data?.length > 0) {
          const dbMovies = moviesData.success ? moviesData.data : [];
          const dbTitles = new Set(dbMovies.map((m: Content) => m.title?.toLowerCase().trim()));
          
          const existingTrending = dbMovies.filter((movie: Content) => 
            dbTitles.has(movie.title?.toLowerCase().trim())
          );
          setTopRatedMovies(existingTrending);
          
          const onlyInTmdb = trendingData.data.filter((t: any) => 
            !dbTitles.has(t.title?.toLowerCase().trim())
          );
          setTmdbTrending(onlyInTmdb);
        }
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
      <div className="min-h-screen bg-[#0a0a0a]" />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]" suppressHydrationWarning>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
              <Link href="/" className="text-xl md:text-2xl font-bold text-white">
                Prime<span className="text-blue-500">Video</span>
              </Link>
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium">
                  Home
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium">
                  TV Shows
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium">
                  Movies
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium">
                  Channels
                </Link>
              </nav>
              <button 
                className="md:hidden p-2 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white text-sm pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-full w-28 sm:w-40 md:w-44 lg:w-48 focus:w-36 sm:focus:w-56 md:focus:w-60 lg:focus:w-64 transition-all focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4">
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium py-2">
                  Home
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium py-2">
                  TV Shows
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium py-2">
                  Movies
                </Link>
                <Link href="/" className="text-white hover:text-blue-400 text-sm font-medium py-2">
                  Channels
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <PrimeVideoHeroBanner content={heroContent} />

      <main className="relative -mt-8 md:-mt-12 lg:-mt-20 z-10 pb-12 md:pb-16 lg:pb-20">
        {loading ? (
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-800 rounded animate-pulse mb-4 sm:mb-6" />
            <div className="flex gap-2 sm:gap-3 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px]">
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {topRatedMovies.length > 0 && (
              <div className="px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                <PrimeVideoContentRow
                  title="Top Rated"
                  items={topRatedMovies}
                  type="movie"
                />
              </div>
            )}

            {tmdbTrending.length > 0 && (
              <div className="px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                <PrimeVideoContentRow
                  title="Trending on TMDB"
                  items={tmdbTrending}
                  type="movie"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-6 md:mb-8 overflow-x-auto px-4 md:px-6 lg:px-8 pb-2 scrollbar-hide">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-black/50 text-gray-300 hover:bg-black/70"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {categoriesWithContent.length > 0 ? (
              categoriesWithContent.map((category) => (
                <div key={category} className="px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                  <PrimeVideoContentRow
                    title={category}
                    items={groupedMovies[category]}
                    type="movie"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 sm:py-20 px-4">
                <Film className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg sm:text-xl text-gray-400">No content available</p>
              </div>
            )}

            {series.length > 0 && (
              <div className="px-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Tv className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Popular TV Shows</h2>
                </div>
                <PrimeVideoContentRow
                  title="TV Shows"
                  items={series}
                  type="series"
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold text-white">
                Prime<span className="text-blue-500">Video</span>
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2024 PrimeVideo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
