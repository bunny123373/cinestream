"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Tv,
  ImageIcon,
  Calendar,
  Globe,
  Tag,
  Star,
  FileText,
  Search,
  Loader2,
} from "lucide-react";
import SeasonEpisodeBuilder from "./SeasonEpisodeBuilder";
import { Season } from "@/types";

interface UploadSeriesFormProps {
  adminKey: string;
  onSuccess?: () => void;
}

export default function UploadSeriesForm({ adminKey, onSuccess }: UploadSeriesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: "",
    backdrop: "",
    language: "",
    category: "",
    year: new Date().getFullYear(),
    rating: "",
    seasons: [] as Season[],
    tmdbId: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);
    setShowResults(true);

    try {
      const response = await fetch(`/api/tmdb?query=${encodeURIComponent(searchQuery)}&type=tv`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.results || [data.data]);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectShow = async (show: any) => {
    setFormData((prev) => ({
      ...prev,
      title: show.title || "",
      description: show.overview || "",
      poster: show.poster || "",
      backdrop: show.backdrop || "",
      year: show.releaseDate ? new Date(show.releaseDate).getFullYear() : new Date().getFullYear(),
      rating: show.rating?.toString() || "",
      tmdbId: show.tmdbId?.toString() || "",
    }));
    setSearchQuery(show.title || "");
    setShowResults(false);
    setSearchResults([]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "rating" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleSeasonsChange = (seasons: Season[]) => {
    setFormData((prev) => ({ ...prev, seasons }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.seasons.length === 0) {
      setError("At least one season is required");
      setLoading(false);
      return;
    }

    for (const season of formData.seasons) {
      if (season.episodes.length === 0) {
        setError(`Season ${season.seasonNumber} must have at least one episode`);
        setLoading(false);
        return;
      }

      for (const episode of season.episodes) {
        if (!episode.episodeTitle.trim()) {
          setError(`Episode ${episode.episodeNumber} in Season ${season.seasonNumber} is missing a title`);
          setLoading(false);
          return;
        }
        if (!episode.downloadLink.trim()) {
          setError(`Episode ${episode.episodeNumber} in Season ${season.seasonNumber} is missing a download link`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: "series",
        poster: formData.poster,
        backdrop: formData.backdrop || null,
        language: formData.language,
        category: formData.category,
        year: Number(formData.year),
        rating: formData.rating ? parseFloat(formData.rating as string) : null,
        seasons: formData.seasons,
      };

      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to upload series");
      }

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        poster: "",
        backdrop: "",
        language: "",
        category: "",
        year: new Date().getFullYear(),
        rating: "",
        seasons: [],
        tmdbId: "",
      });
      setSearchQuery("");

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
        border: "1px solid #1F232D",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
          <Tv className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <h2 className="text-xl font-bold text-[#F9FAFB]">Upload Series</h2>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
        <form onSubmit={handleSearch} className="relative">
          <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Search from TMDB (Auto-fill details)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) {
                  setShowResults(false);
                  setSearchResults([]);
                }
              }}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="flex-1 px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="Search TV shows..."
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-[#1a1d26] border border-[#1F232D] rounded-xl max-h-60 overflow-y-auto">
              {searchResults.map((show: any) => (
                <button
                  key={show.tmdbId}
                  type="button"
                  onClick={() => handleSelectShow(show)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#1F232D] transition-colors text-left"
                >
                  {show.poster && (
                    <img src={show.poster} alt="" className="w-10 h-14 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F9FAFB] font-medium truncate">{show.title}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {show.releaseDate?.split("-")[0]} • {show.rating?.toFixed(1)} ★
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
        >
          Series uploaded successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="Enter series title"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors resize-none"
              placeholder="Enter series description"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="https://example.com/poster.jpg"
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
              value={formData.backdrop}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="https://example.com/backdrop.jpg"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="e.g., English, Hindi"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="e.g., Drama, Thriller"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Rating (TMDB)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min={0}
              max={10}
              step={0.1}
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#8B5CF6] focus:outline-none transition-colors"
              placeholder="0.0 - 10.0"
            />
          </div>
        </div>

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
          <SeasonEpisodeBuilder
            seasons={formData.seasons}
            onChange={handleSeasonsChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-[#8B5CF6] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Series
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
