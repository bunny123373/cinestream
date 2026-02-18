"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Film,
  Calendar,
  Globe,
  Tag,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";
import IframePlayer from "@/components/IframePlayer";
import { Content } from "@/types";
import PrimeVideoContentRow from "@/components/PrimeVideoContentRow";

export default function WatchMoviePage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Content | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/content/${id}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch movie");
          return;
        }

        if (data.data.type !== "movie") {
          setError("This content is not a movie");
          return;
        }

        setMovie(data.data);

        // Fetch related movies (same language/category)
        const relatedResponse = await fetch(
          `/api/content?type=movie&language=${data.data.language}&category=${data.data.category}&limit=6`
        );
        const relatedData = await relatedResponse.json();

        if (relatedData.success) {
          // Filter out current movie
          const filtered = relatedData.data.filter(
            (m: Content) => m._id !== id && m.id !== id
          );
          setRelatedMovies(filtered.slice(0, 5));
        }
      } catch (err) {
        setError("An error occurred while fetching the movie");
        console.error(err);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050608]" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Cine<span className="text-yellow-500">Stream</span>
        </h1>
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
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
            {error || "Movie not found"}
          </h1>
          <p className="text-[#9CA3AF] mb-6">
            The movie you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5C542] text-[#050608] rounded-xl font-semibold hover:bg-[#F5C542]/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050608]/80 backdrop-blur-xl border-b border-[#1F232D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#F9FAFB] hover:text-[#F5C542] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-[#F5C542]" />
              <span className="text-xl font-bold text-[#F9FAFB]">
                CineStream
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        <section className="mb-8">
          <IframePlayer
            embedIframeLink={movie.movieData?.embedIframeLink}
            title={movie.title}
          />
        </section>

        {/* Movie Info & Download Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
              border: "1px solid #1F232D",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Movie Details */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9FAFB] mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {movie.rating !== undefined && movie.rating !== null && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5C542]/10 text-[#F5C542] text-sm font-medium">
                      <Star className="w-4 h-4" />
                      {Number(movie.rating).toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                    <Calendar className="w-4 h-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                    <Globe className="w-4 h-4" />
                    {movie.language}
                  </span>
                  {movie.duration && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                      <Clock className="w-4 h-4" />
                      {movie.duration}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-[#9CA3AF] text-sm">{movie.category}</span>
                </div>

                <p className="text-[#9CA3AF] leading-relaxed max-w-3xl">
                  {movie.description}
                </p>
              </div>

              {/* Download Button */}
              <div className="flex-shrink-0">
                <Link
                  href={`/download/${movie._id || movie.id}?type=movie`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download Movie
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Related Movies Section */}
        {relatedMovies.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <PrimeVideoContentRow
              title="Related Movies"
              items={relatedMovies}
              type="movie"
            />
          </section>
        )}
      </main>
    </div>
  );
}
