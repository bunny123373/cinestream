"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Film,
  Tv,
  ImageIcon,
  Calendar,
  Globe,
  Tag,
  Star,
  FileText,
  Link2,
  Download,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Play,
  Check,
} from "lucide-react";
import { Content, Episode, Season } from "@/types";

interface EditContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  adminKey: string;
}

export default function EditContentModal({
  content,
  isOpen,
  onClose,
  onSave,
  adminKey,
}: EditContentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Content | null>(null);
  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([]);

  useEffect(() => {
    if (content) {
      setFormData({ ...content });
      if (content.seasons) {
        setExpandedSeasons(content.seasons.map((s) => s.seasonNumber));
      }
    }
  }, [content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "year" || name === "rating" ? (value ? parseFloat(value) : undefined) : value,
          }
        : null
    );
  };

  const handleMovieDataChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            movieData: {
              ...prev.movieData,
              [field]: value || null,
            },
          }
        : null
    );
  };

  // Season/Episode handlers for series
  const toggleSeason = (seasonNumber: number) => {
    setExpandedSeasons((prev) =>
      prev.includes(seasonNumber)
        ? prev.filter((s) => s !== seasonNumber)
        : [...prev, seasonNumber]
    );
  };

  const addSeason = () => {
    if (!formData?.seasons) return;
    const newSeasonNumber =
      formData.seasons.length > 0
        ? Math.max(...formData.seasons.map((s) => s.seasonNumber)) + 1
        : 1;
    const newSeason: Season = {
      seasonNumber: newSeasonNumber,
      episodes: [],
    };
    setFormData((prev) =>
      prev
        ? { ...prev, seasons: [...(prev.seasons || []), newSeason] }
        : null
    );
    setExpandedSeasons((prev) => [...prev, newSeasonNumber]);
  };

  const removeSeason = (seasonNumber: number) => {
    if (!formData?.seasons) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            seasons: prev.seasons?.filter((s) => s.seasonNumber !== seasonNumber),
          }
        : null
    );
    setExpandedSeasons((prev) => prev.filter((s) => s !== seasonNumber));
  };

  const addEpisode = (seasonNumber: number) => {
    if (!formData?.seasons) return;
    const season = formData.seasons.find((s) => s.seasonNumber === seasonNumber);
    if (!season) return;

    const newEpisodeNumber =
      season.episodes.length > 0
        ? Math.max(...season.episodes.map((e) => e.episodeNumber)) + 1
        : 1;

    const newEpisode: Episode = {
      episodeNumber: newEpisodeNumber,
      episodeTitle: `Episode ${newEpisodeNumber}`,
      embedIframeLink: "",
      downloadLink: "",
      quality: "HD",
    };

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            seasons: prev.seasons?.map((s) =>
              s.seasonNumber === seasonNumber
                ? { ...s, episodes: [...s.episodes, newEpisode] }
                : s
            ),
          }
        : null
    );
  };

  const removeEpisode = (seasonNumber: number, episodeNumber: number) => {
    if (!formData?.seasons) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            seasons: prev.seasons?.map((s) =>
              s.seasonNumber === seasonNumber
                ? {
                    ...s,
                    episodes: s.episodes.filter(
                      (e) => e.episodeNumber !== episodeNumber
                    ),
                  }
                : s
            ),
          }
        : null
    );
  };

  const updateEpisode = (
    seasonNumber: number,
    episodeNumber: number,
    updates: Partial<Episode>
  ) => {
    if (!formData?.seasons) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            seasons: prev.seasons?.map((s) =>
              s.seasonNumber === seasonNumber
                ? {
                    ...s,
                    episodes: s.episodes.map((e) =>
                      e.episodeNumber === episodeNumber ? { ...e, ...updates } : e
                    ),
                  }
                : s
            ),
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      // Validate based on type
      if (formData.type === "movie") {
        if (!formData.movieData?.downloadLink) {
          throw new Error("Download link is required for movies");
        }
      } else if (formData.type === "series") {
        if (!formData.seasons || formData.seasons.length === 0) {
          throw new Error("At least one season is required");
        }
        for (const season of formData.seasons) {
          if (season.episodes.length === 0) {
            throw new Error(`Season ${season.seasonNumber} must have at least one episode`);
          }
          for (const episode of season.episodes) {
            if (!episode.downloadLink) {
              throw new Error(
                `Episode ${episode.episodeNumber} in Season ${season.seasonNumber} is missing a download link`
              );
            }
          }
        }
      }

      const response = await fetch(`/api/content/${formData._id || formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update content");
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
            border: "1px solid #1F232D",
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#1F232D] bg-[#0E1015]/95 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  formData.type === "movie"
                    ? "bg-[#F5C542]/10"
                    : "bg-[#8B5CF6]/10"
                }`}
              >
                {formData.type === "movie" ? (
                  <Film className="w-5 h-5 text-[#F5C542]" />
                ) : (
                  <Tv className="w-5 h-5 text-[#8B5CF6]" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F9FAFB]">
                  Edit {formData.type === "movie" ? "Movie" : "Series"}
                </h2>
                <p className="text-sm text-[#9CA3AF]">{formData.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#1F232D] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Poster URL *
                </label>
                <input
                  type="url"
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Backdrop URL
                </label>
                <input
                  type="url"
                  name="backdrop"
                  value={formData.backdrop || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Language *
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min={1900}
                  max={2100}
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <Star className="w-4 h-4 inline mr-1" />
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleChange}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Movie-specific fields */}
            {formData.type === "movie" && (
              <div
                className="p-6 rounded-xl space-y-6"
                style={{
                  background: "rgba(245, 197, 66, 0.05)",
                  border: "1px solid rgba(245, 197, 66, 0.2)",
                }}
              >
                <h3 className="text-lg font-semibold text-[#F5C542] flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Streaming Links
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      Embed Iframe Link
                    </label>
                    <input
                      type="url"
                      value={formData.movieData?.embedIframeLink || ""}
                      onChange={(e) =>
                        handleMovieDataChange("embedIframeLink", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                      placeholder="https://example.com/embed/..."
                    />
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Paste embed player URL (iframe src link)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      <Download className="w-4 h-4 inline mr-1" />
                      Download Link *
                    </label>
                    <input
                      type="url"
                      value={formData.movieData?.downloadLink || ""}
                      onChange={(e) =>
                        handleMovieDataChange("downloadLink", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] focus:border-[#F5C542] focus:outline-none transition-colors"
                      placeholder="https://example.com/download/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Series-specific fields */}
            {formData.type === "series" && formData.seasons && (
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "rgba(139, 92, 246, 0.05)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                <h3 className="text-lg font-semibold text-[#8B5CF6] mb-4">
                  Seasons & Episodes
                </h3>

                <div className="space-y-4">
                  {formData.seasons.map((season) => (
                    <div
                      key={season.seasonNumber}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: "#050608",
                        border: "1px solid #1F232D",
                      }}
                    >
                      {/* Season Header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1F232D]/30 transition-colors"
                        onClick={() => toggleSeason(season.seasonNumber)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-[#F5C542]">
                              S{season.seasonNumber}
                            </span>
                          </div>
                          <span className="font-medium text-[#F9FAFB]">
                            Season {season.seasonNumber}
                          </span>
                          <span className="text-sm text-[#9CA3AF]">
                            ({season.episodes.length} episode
                            {season.episodes.length !== 1 ? "s" : ""})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSeason(season.seasonNumber);
                            }}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedSeasons.includes(season.seasonNumber) ? (
                            <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                          )}
                        </div>
                      </div>

                      {/* Episodes */}
                      {expandedSeasons.includes(season.seasonNumber) && (
                        <div className="p-4 pt-0 space-y-3">
                          {season.episodes.map((episode) => (
                            <div
                              key={episode.episodeNumber}
                              className="p-4 rounded-xl bg-[#0E1015] border border-[#1F232D] space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-[#8B5CF6]/10 flex items-center justify-center">
                                    <Play className="w-3 h-3 text-[#8B5CF6]" />
                                  </div>
                                  <span className="text-sm font-medium text-[#F9FAFB]">
                                    Episode {episode.episodeNumber}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeEpisode(
                                      season.seasonNumber,
                                      episode.episodeNumber
                                    )
                                  }
                                  className="p-1.5 rounded hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                                    Episode Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={episode.episodeTitle}
                                    onChange={(e) =>
                                      updateEpisode(
                                        season.seasonNumber,
                                        episode.episodeNumber,
                                        { episodeTitle: e.target.value }
                                      )
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                                    Quality
                                  </label>
                                  <select
                                    value={episode.quality}
                                    onChange={(e) =>
                                      updateEpisode(
                                        season.seasonNumber,
                                        episode.episodeNumber,
                                        { quality: e.target.value }
                                      )
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                                  >
                                    <option value="SD">SD</option>
                                    <option value="HD">HD</option>
                                    <option value="FHD">FHD</option>
                                    <option value="4K">4K</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                                    <Link2 className="w-3 h-3 inline mr-1" />
                                    Embed Iframe Link
                                  </label>
                                  <input
                                    type="url"
                                    value={episode.embedIframeLink || ""}
                                    onChange={(e) =>
                                      updateEpisode(
                                        season.seasonNumber,
                                        episode.episodeNumber,
                                        { embedIframeLink: e.target.value }
                                      )
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                                    placeholder="https://example.com/embed/..."
                                  />
                                  <p className="mt-1 text-xs text-[#9CA3AF]">
                                    Paste embed player URL (iframe src link)
                                  </p>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1">
                                    <Download className="w-3 h-3 inline mr-1" />
                                    Download Link *
                                  </label>
                                  <input
                                    type="url"
                                    value={episode.downloadLink}
                                    onChange={(e) =>
                                      updateEpisode(
                                        season.seasonNumber,
                                        episode.episodeNumber,
                                        { downloadLink: e.target.value }
                                      )
                                    }
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                                    placeholder="https://example.com/download/..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addEpisode(season.seasonNumber)}
                            className="w-full py-3 rounded-xl border border-dashed border-[#1F232D] text-[#9CA3AF] hover:text-[#F5C542] hover:border-[#F5C542]/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Episode
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSeason}
                    className="w-full py-4 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] hover:bg-[#F5C542]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Season
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1F232D]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-[#1F232D] text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#9CA3AF] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#F5C542] text-[#050608] font-semibold flex items-center gap-2 hover:bg-[#F5C542]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050608] border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
