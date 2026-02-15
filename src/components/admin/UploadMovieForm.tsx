"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Film, Link2, Download, ImageIcon, Calendar, Globe, Tag, Star, FileText, Search, Loader2 } from "lucide-react";

interface UploadMovieFormProps {
  adminKey: string;
  onSuccess?: () => void;
}

export default function UploadMovieForm({ adminKey, onSuccess }: UploadMovieFormProps) {
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
    duration: "",
    embedIframeLink: "",
    downloadLink: "",
    tmdbId: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);
    setShowResults(true);

    try {
      const response = await fetch(`/api/tmdb?query=${encodeURIComponent(searchQuery)}&type=movie`);
      const data = await response.json();
      console.log("TMDB Response:", data);
      
      if (data.success && data.data?.results && data.data.results.length > 0) {
        setSearchResults(data.data.results);
      } else {
        console.log("No results or error:", data.message);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectMovie = (movie: any) => {
    setFormData((prev) => ({
      ...prev,
      title: movie.title || "",
      description: movie.overview || "",
      poster: movie.poster || "",
      backdrop: movie.backdrop || "",
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
      rating: movie.rating?.toString() || "",
      tmdbId: movie.tmdbId?.toString() || "",
    }));
    setSearchQuery(movie.title || "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: "movie",
        poster: formData.poster,
        backdrop: formData.backdrop || null,
        language: formData.language,
        category: formData.category,
        year: Number(formData.year),
        rating: formData.rating ? parseFloat(formData.rating as string) : null,
        duration: formData.duration || null,
        movieData: {
          embedIframeLink: formData.embedIframeLink || null,
          downloadLink: formData.downloadLink,
        },
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
        throw new Error(data.message || "Failed to upload movie");
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
        duration: "",
        embedIframeLink: "",
        downloadLink: "",
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
        <div className="w-10 h-10 rounded-lg bg-[#F5C542]/10 flex items-center justify-center">
          <Film className="w-5 h-5 text-[#F5C542]" />
        </div>
        <h2 className="text-xl font-bold text-[#F9FAFB]">Upload Movie</h2>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 relative">
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
              placeholder="Search movies..."
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
            <div className="absolute z-50 left-0 right-0 mt-2 bg-[#1a1d26] border border-[#1F232D] rounded-xl max-h-60 overflow-y-auto shadow-xl">
              {searchResults.map((movie: any) => (
                <button
                  key={movie.tmdbId}
                  type="button"
                  onClick={() => handleSelectMovie(movie)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#8B5CF6]/20 transition-colors text-left border-b border-[#1F232D]/50 last:border-0"
                >
                  {movie.poster && (
                    <img src={movie.poster} alt="" className="w-10 h-14 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F9FAFB] font-medium truncate">{movie.title}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {movie.releaseDate?.split("-")[0]} • {movie.rating?.toFixed(1)} ★
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
          Movie uploaded successfully!
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
              placeholder="Enter movie title"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors resize-none"
              placeholder="Enter movie description"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
              placeholder="e.g., Action, Drama"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
              placeholder="0.0 - 10.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
              placeholder="e.g., 2h 30m"
            />
          </div>
        </div>

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
                name="embedIframeLink"
                value={formData.embedIframeLink}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
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
                name="downloadLink"
                value={formData.downloadLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
                placeholder="https://example.com/download/..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-[#F5C542] text-[#050608] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5C542]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#050608] border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Movie
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
