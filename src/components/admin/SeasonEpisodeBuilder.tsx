"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Play,
  Link2,
  Download,
  Check,
} from "lucide-react";
import { Episode, Season } from "@/types";

interface SeasonEpisodeBuilderProps {
  seasons: Season[];
  onChange: (seasons: Season[]) => void;
}

export default function SeasonEpisodeBuilder({
  seasons,
  onChange,
}: SeasonEpisodeBuilderProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([1]);

  const toggleSeason = (seasonNumber: number) => {
    setExpandedSeasons((prev) =>
      prev.includes(seasonNumber)
        ? prev.filter((s) => s !== seasonNumber)
        : [...prev, seasonNumber]
    );
  };

  const addSeason = () => {
    const newSeasonNumber =
      seasons.length > 0
        ? Math.max(...seasons.map((s) => s.seasonNumber)) + 1
        : 1;
    const newSeason: Season = {
      seasonNumber: newSeasonNumber,
      episodes: [],
    };
    onChange([...seasons, newSeason]);
    setExpandedSeasons((prev) => [...prev, newSeasonNumber]);
  };

  const removeSeason = (seasonNumber: number) => {
    onChange(seasons.filter((s) => s.seasonNumber !== seasonNumber));
    setExpandedSeasons((prev) => prev.filter((s) => s !== seasonNumber));
  };

  const addEpisode = (seasonNumber: number) => {
    const season = seasons.find((s) => s.seasonNumber === seasonNumber);
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

    onChange(
      seasons.map((s) =>
        s.seasonNumber === seasonNumber
          ? { ...s, episodes: [...s.episodes, newEpisode] }
          : s
      )
    );
  };

  const removeEpisode = (seasonNumber: number, episodeNumber: number) => {
    onChange(
      seasons.map((s) =>
        s.seasonNumber === seasonNumber
          ? {
              ...s,
              episodes: s.episodes.filter(
                (e) => e.episodeNumber !== episodeNumber
              ),
            }
          : s
      )
    );
  };

  const updateEpisode = (
    seasonNumber: number,
    episodeNumber: number,
    updates: Partial<Episode>
  ) => {
    onChange(
      seasons.map((s) =>
        s.seasonNumber === seasonNumber
          ? {
              ...s,
              episodes: s.episodes.map((e) =>
                e.episodeNumber === episodeNumber ? { ...e, ...updates } : e
              ),
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {seasons.length === 0 && (
        <div className="text-center py-8 text-[#9CA3AF]">
          No seasons added yet. Click the button below to add a season.
        </div>
      )}

      {seasons.map((season) => (
        <motion.div
          key={season.seasonNumber}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
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

          {/* Episodes List */}
          <AnimatePresence>
            {expandedSeasons.includes(season.seasonNumber) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {season.episodes.length === 0 && (
                    <div className="text-center py-4 text-[#9CA3AF] text-sm">
                      No episodes added yet.
                    </div>
                  )}

                  {season.episodes.map((episode) => (
                    <motion.div
                      key={episode.episodeNumber}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-[#050608] border border-[#1F232D] space-y-4"
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
                            className="w-full px-3 py-2 rounded-lg bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                            placeholder="Episode title"
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
                            className="w-full px-3 py-2 rounded-lg bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
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
                            className="w-full px-3 py-2 rounded-lg bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
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
                            className="w-full px-3 py-2 rounded-lg bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-sm focus:border-[#F5C542] focus:outline-none transition-colors"
                            placeholder="https://example.com/download/..."
                          />
                        </div>
                      </div>
                    </motion.div>
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
  );
}
