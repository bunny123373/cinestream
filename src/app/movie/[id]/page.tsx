"use client";

import React, { useEffect, useState, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Content } from "@/types";
import PrimeVideoContentRow from "@/components/PrimeVideoContentRow";
import DownloadAd from "@/components/DownloadAd";

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Content | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Content[]>([]);
  const [relatedSeries, setRelatedSeries] = useState<Content[]>([]);
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

        if (data.data.type === "series") {
          window.location.href = `/series/${id}`;
          return;
        }

        setMovie(data.data);

        const [relatedMoviesRes, relatedSeriesRes] = await Promise.all([
          fetch(`/api/content?category=${encodeURIComponent(data.data.category)}&limit=12`),
          fetch(`/api/content?type=series&limit=6`),
        ]);

        const moviesData = await relatedMoviesRes.json();
        const seriesData = await relatedSeriesRes.json();

        if (moviesData.success) {
          setRelatedMovies(moviesData.data.filter((m: Content) => m._id !== id && m.type === "movie"));
        }
        if (seriesData.success) {
          setRelatedSeries(seriesData.data);
        }
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050608]" />
    );
  }

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
      <DownloadAd />
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        {movie.backdrop && (
          <div className="absolute inset-0 h-[50vh] overflow-hidden">
            <img
              src={movie.backdrop}
              alt={movie.title}
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
                src={movie.poster}
                alt={movie.title}
                className="w-48 sm:w-56 md:w-64 rounded-xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F9FAFB] mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
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
                {movie.category && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm">
                    <Tag className="w-4 h-4" />
                    {movie.category}
                  </span>
                )}
              </div>

              <p className="text-[#9CA3AF] text-lg mb-8 max-w-2xl">
                {movie.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {hasEmbedLink ? (
                  <Link
                    href={`/watch/${movie._id || movie.id}`}
                    className="flex items-center gap-2 px-8 py-4 bg-[#F5C542] text-[#050608] rounded-xl font-bold hover:bg-[#F5C542]/90 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-8 py-4 bg-gray-600 text-gray-400 rounded-xl font-bold cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Coming Soon
                  </button>
                )}

                {movie.movieData?.downloadLink && (
                  <Link
                    href={`/download/${movie._id || movie.id}?type=movie`}
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-4 bg-[#1F232D] text-[#F9FAFB] rounded-xl font-medium hover:bg-[#1F232D]/80 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <PrimeVideoContentRow
            title="Related Movies"
            items={relatedMovies}
            type="movie"
          />
        </div>
      )}

      {/* Related Series */}
      {relatedSeries.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <PrimeVideoContentRow
            title="Popular Series"
            items={relatedSeries}
            type="series"
          />
        </div>
      )}
    </div>
  );
}
