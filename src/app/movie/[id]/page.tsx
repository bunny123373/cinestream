"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
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
import { Content } from "@/types";

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError("An error occurred while fetching the movie");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const hasEmbedLink = !!movie?.movieData?.embedIframeLink;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#9CA3AF]">Loading movie...</p>
        </div>
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

      {/* Hero Section with Backdrop */}
      <div className="relative">
        {movie.backdrop && (
          <div className="absolute inset-0 h-[500px]">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(5, 6, 8, 0.3) 0%, rgba(5, 6, 8, 0.8) 60%, #050608 100%)",
              }}
            />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div
                className="w-64 md:w-80 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  border: "2px solid #1F232D",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                }}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 flex flex-col justify-end"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9FAFB] mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {movie.rating && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5C542]/10 text-[#F5C542] text-sm font-medium">
                    <Star className="w-4 h-4" />
                    {movie.rating.toFixed(1)}
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

              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-[#9CA3AF]">{movie.category}</span>
              </div>

              <p className="text-[#9CA3AF] leading-relaxed mb-8 max-w-2xl">
                {movie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {hasEmbedLink ? (
                  <Link
                    href={`/watch/${movie._id || movie.id}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5C542] text-[#050608] rounded-xl font-semibold transition-all hover:scale-105"
                    style={{
                      boxShadow: "0 0 30px rgba(245, 197, 66, 0.3)",
                    }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#1F232D] text-[#6B7280] rounded-xl font-semibold cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Watch Unavailable
                  </button>
                )}

                <a
                  href={movie.movieData?.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
            border: "1px solid #1F232D",
          }}
        >
          <h2 className="text-xl font-bold text-[#F9FAFB] mb-4">
            Movie Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-[#9CA3AF] mb-1">Release Year</p>
              <p className="text-[#F9FAFB] font-medium">{movie.year}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF] mb-1">Language</p>
              <p className="text-[#F9FAFB] font-medium">{movie.language}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF] mb-1">Category</p>
              <p className="text-[#F9FAFB] font-medium">{movie.category}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF] mb-1">Rating</p>
              <p className="text-[#F9FAFB] font-medium">
                {movie.rating ? `${movie.rating}/10` : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
