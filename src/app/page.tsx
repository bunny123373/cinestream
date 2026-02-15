"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Tv, Search, Star, TrendingUp, Clock, Play, Filter } from "lucide-react";
import { Content } from "@/types";

const CATEGORIES = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Sci-Fi"];

export default function HomePage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch("/api/content?type=movie"),
          fetch("/api/content?type=series&limit=8"),
        ]);

        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();

        if (moviesData.success) setMovies(moviesData.data);
        if (seriesData.success) setSeries(seriesData.data);
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

  const MovieCard = ({ movie, index }: { movie: Content; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative w-full"
    >
      <Link href={`/movie/${movie._id || movie.id}`}>
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[2/3] transition-all duration-500 hover:scale-105 hover:z-10"
          style={{ 
            border: "1px solid #1F232D",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
          }}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          {movie.movieData?.embedIframeLink && (
            <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#22C55E]/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-2 h-2 sm:w-3 sm:h-3 text-[#22C55E] fill-current" />
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1 sm:gap-2">
            {movie.rating && movie.rating > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] sm:text-xs font-medium">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 text-[#F5C542] fill-[#F5C542]" />
                <span className="text-[#F5C542]">{movie.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-2 sm:translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-bold text-[#F9FAFB] text-sm sm:text-lg line-clamp-2 mb-1 sm:mb-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-[#F5C542]/20 text-[#F5C542] font-medium">
                {movie.year}
              </span>
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6] font-medium">
                {movie.language}
              </span>
              {movie.duration && (
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-white/10 text-[#9CA3AF] hidden sm:inline">
                  {movie.duration}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-[#9CA3AF] mt-1 sm:mt-2 line-clamp-2 hidden sm:block">
              {movie.description}
            </p>
          </div>

          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F5C542]/50 rounded-xl sm:rounded-2xl transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050608]">
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-xl border-b border-[#1F232D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F5C542] to-[#F5C542]/60 flex items-center justify-center">
                <Film className="w-5 h-5 text-[#050608]" />
              </div>
              <span className="text-xl font-bold text-[#F9FAFB]">
                Cine<span className="text-[#F5C542]">Stream</span>
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/?type=movie"
                className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                Movies
              </Link>
              <Link
                href="/?type=series"
                className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                Series
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-[#1F232D] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(ellipse at top, rgba(245, 197, 66, 0.2) 0%, transparent 50%)",
        }} />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F5C542]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#F9FAFB] mb-6 tracking-tight">
              Stream Unlimited{" "}
              <span className="text-[#F5C542]">Movies</span>
            </h1>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10">
              Experience cinema at your fingertips. High-quality streaming with zero buffering.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#movies"
                className="px-8 py-4 bg-[#F5C542] text-[#050608] rounded-xl font-bold hover:bg-[#F5C542]/90 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,197,66,0.4)]"
              >
                <Film className="w-5 h-5 inline mr-2" />
                Browse Movies
              </Link>
              <Link
                href="#series"
                className="px-8 py-4 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#8B5CF6]/90 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
              >
                <Tv className="w-5 h-5 inline mr-2" />
                Browse Series
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-[#1F232D] bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Film, label: "Movies", value: movies.length, color: "#F5C542" },
              { icon: Tv, label: "Series", value: series.length, color: "#8B5CF6" },
              { icon: Star, label: "4K Quality", value: "UHD", color: "#22C55E" },
              { icon: TrendingUp, label: "Daily Updates", value: "New", color: "#F59E0B" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1F232D]/50 to-transparent border border-[#1F232D] hover:border-[#F5C542]/30 transition-all group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5C542]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#F5C542]/10 flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-3xl font-bold text-[#F9FAFB]">{stat.value}</p>
                  <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="movies" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5C542] to-[#F5C542]/60 flex items-center justify-center">
                <Film className="w-6 h-6 text-[#050608]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#F9FAFB]">Movies</h2>
                <p className="text-[#9CA3AF]">{filteredMovies.length} movies available</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <Filter className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-[#F5C542] text-[#050608]"
                    : "bg-[#1F232D] text-[#9CA3AF] hover:bg-[#1F232D]/80 hover:text-[#F9FAFB]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl sm:rounded-2xl bg-[#0E1015] animate-pulse" />
              ))}
            </div>
          ) : selectedCategory === "All" ? (
            Object.entries(groupedMovies).map(([category, categoryMovies]) => (
              <div key={category} className="mb-10 sm:mb-14">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#F9FAFB]">{category}</h3>
                  <span className="text-xs sm:text-sm text-[#9CA3AF]">({categoryMovies.length} movies)</span>
                </div>
                <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {categoryMovies.slice(0, 10).map((movie, index) => (
                    <div key={movie._id || movie.id} className="w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[16%] flex-shrink-0">
                      <MovieCard movie={movie} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {filteredMovies.map((movie, index) => (
                <div key={movie._id || movie.id} className="w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[16%] flex-shrink-0">
                  <MovieCard movie={movie} index={index} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredMovies.length === 0 && (
            <div className="text-center py-20">
              <Film className="w-16 h-16 mx-auto mb-4 text-[#F5C542]/30" />
              <p className="text-xl text-[#9CA3AF]">No movies found in this category</p>
            </div>
          )}
        </div>
      </section>

      <section id="series" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1F232D] bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/60 flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#F9FAFB]">Popular Series</h2>
                <p className="text-[#9CA3AF]">{series.length} series available</p>
              </div>
            </div>
            <Link
              href="/?type=series"
              className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 transition-colors text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[16%] flex-shrink-0">
                  <div className="aspect-[2/3] rounded-xl sm:rounded-2xl bg-[#0E1015] animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {series.map((show, index) => (
                <div key={show._id || show.id} className="w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[16%] flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/series/${show._id || show.id}`}>
                      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[2/3] transition-all duration-500 hover:scale-105"
                        style={{ border: "1px solid #1F232D" }}>
                        <img
                          src={show.poster}
                          alt={show.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                          <h3 className="font-bold text-[#F9FAFB] text-sm sm:text-lg line-clamp-2 mb-1 sm:mb-2">
                            {show.title}
                          </h3>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6]">
                              {show.seasons?.length} Season{(show.seasons?.length || 0) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          )}

          {!loading && series.length === 0 && (
            <div className="text-center py-20">
              <Tv className="w-16 h-16 mx-auto mb-4 text-[#8B5CF6]/30" />
              <p className="text-xl text-[#9CA3AF]">No series available yet</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1F232D]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-[#F5C542]" />
              <span className="text-xl font-bold text-[#F9FAFB]">
                Cine<span className="text-[#F5C542]">Stream</span>
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm">
              © 2024 CineStream. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
