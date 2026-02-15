"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Tv,
  Calendar,
  Globe,
  Tag,
  Star,
  Play,
  Check,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import IframePlayer from "@/components/IframePlayer";
import { Content, Episode, Season } from "@/types";

export default function WatchSeriesPage() {
  const params = useParams();
  const id = params.id as string;

  const [series, setSeries] = useState<Content | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`/api/content/${id}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch series");
          return;
        }

        if (data.data.type !== "series") {
          setError("This content is not a series");
          return;
        }

        setSeries(data.data);

        // Set initial episode (first episode of first season with embed link, or just first episode)
        if (data.data.seasons && data.data.seasons.length > 0) {
          const firstSeason = data.data.seasons[0];
          setSelectedSeason(firstSeason.seasonNumber);

          // Find first episode with embedIframeLink, or default to first episode
          const firstEpisodeWithEmbed = firstSeason.episodes.find(
            (ep: Episode) => ep.embedIframeLink
          );
          setSelectedEpisode(
            firstEpisodeWithEmbed || firstSeason.episodes[0] || null
          );
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

  const currentSeason = series?.seasons?.find(
    (s) => s.seasonNumber === selectedSeason
  );

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    // Scroll to player on mobile
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
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
              <Tv className="w-6 h-6 text-[#F5C542]" />
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
            embedIframeLink={selectedEpisode?.embedIframeLink}
            title={
              selectedEpisode
                ? `${series.title} - S${selectedSeason}E${selectedEpisode.episodeNumber}: ${selectedEpisode.episodeTitle}`
                : series.title
            }
          />
        </section>

        {/* Episode Info & Download Section */}
        {selectedEpisode && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
                border: "1px solid #1F232D",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] mb-2">
                    S{selectedSeason}E{selectedEpisode.episodeNumber}:{" "}
                    {selectedEpisode.episodeTitle}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-medium">
                    {selectedEpisode.quality}
                  </span>
                </div>
                <a
                  href={selectedEpisode.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download Episode
                </a>
              </div>
            </div>
          </motion.section>
        )}

        {/* Series Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
              border: "1px solid #1F232D",
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] mb-4">
              {series.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {series.rating && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5C542]/10 text-[#F5C542] text-sm font-medium">
                  <Star className="w-4 h-4" />
                  {series.rating.toFixed(1)}
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
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F232D] text-[#9CA3AF] text-sm">
                <Tv className="w-4 h-4" />
                {series.seasons?.length || 0} Season
                {(series.seasons?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-[#9CA3AF] text-sm">{series.category}</span>
            </div>

            <p className="text-[#9CA3AF] leading-relaxed">{series.description}</p>
          </div>
        </motion.section>

        {/* Season Selector & Episode List */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F9FAFB]">
              Episodes
            </h2>

            {/* Season Selector Dropdown */}
            {series.seasons && series.seasons.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] hover:border-[#F5C542] transition-colors"
                >
                  <span>Season {selectedSeason}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showSeasonDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showSeasonDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-40 rounded-xl bg-[#0E1015] border border-[#1F232D] overflow-hidden z-10"
                      style={{
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {series.seasons.map((season: Season) => (
                        <button
                          key={season.seasonNumber}
                          onClick={() => {
                            setSelectedSeason(season.seasonNumber);
                            setShowSeasonDropdown(false);
                            // Select first episode of new season
                            const firstEpisodeWithEmbed = season.episodes.find(
                              (ep) => ep.embedIframeLink
                            );
                            setSelectedEpisode(
                              firstEpisodeWithEmbed || season.episodes[0] || null
                            );
                          }}
                          className={`w-full px-4 py-3 text-left text-[#F9FAFB] hover:bg-[#1F232D] transition-colors flex items-center justify-between ${
                            selectedSeason === season.seasonNumber
                              ? "bg-[#F5C542]/10"
                              : ""
                          }`}
                        >
                          <span>Season {season.seasonNumber}</span>
                          {selectedSeason === season.seasonNumber && (
                            <Check className="w-4 h-4 text-[#F5C542]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSeason?.episodes.map((episode: Episode, index: number) => {
              const isSelected = selectedEpisode?.episodeNumber === episode.episodeNumber;
              const hasEmbed = !!episode.embedIframeLink;

              return (
                <motion.div
                  key={episode.episodeNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => handleEpisodeClick(episode)}
                  className={`group cursor-pointer rounded-xl p-4 transition-all ${
                    isSelected
                      ? "bg-[#F5C542]/10 border-2 border-[#F5C542]"
                      : "bg-[#0E1015] border border-[#1F232D] hover:border-[#3a3f4d]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Episode Number / Play Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-[#F5C542]"
                          : hasEmbed
                          ? "bg-[#1F232D] group-hover:bg-[#F5C542]/20"
                          : "bg-[#1F232D]/50"
                      }`}
                    >
                      {isSelected ? (
                        <Play className="w-5 h-5 text-[#050608] fill-current" />
                      ) : (
                        <span
                          className={`text-lg font-bold ${
                            hasEmbed ? "text-[#F9FAFB]" : "text-[#9CA3AF]"
                          }`}
                        >
                          {episode.episodeNumber}
                        </span>
                      )}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold truncate ${
                          isSelected
                            ? "text-[#F5C542]"
                            : hasEmbed
                            ? "text-[#F9FAFB]"
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        {episode.episodeTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
                          {episode.quality}
                        </span>
                        {!hasEmbed && (
                          <span className="text-xs text-[#9CA3AF]">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    <a
                      href={episode.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-[#F5C542]/20 text-[#F5C542]"
                          : "bg-[#1F232D] text-[#9CA3AF] hover:text-[#22C55E]"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
