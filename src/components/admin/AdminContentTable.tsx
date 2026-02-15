"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Film,
  Tv,
  ExternalLink,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Content, Episode } from "@/types";

interface AdminContentTableProps {
  content: Content[];
  onEdit: (content: Content) => void;
  onDelete: (content: Content) => void;
  loading?: boolean;
}

export default function AdminContentTable({
  content,
  onEdit,
  onDelete,
  loading = false,
}: AdminContentTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteClick = (item: Content) => {
    if (deleteConfirm === (item._id || item.id)) {
      onDelete(item);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(item._id || item.id || null);
    }
  };

  const checkEmbedAvailable = (item: Content): boolean => {
    if (item.type === "movie") {
      return !!item.movieData?.embedIframeLink;
    } else {
      // For series, check if at least one episode has embedIframeLink
      return (
        item.seasons?.some((season) =>
          season.episodes.some((episode: Episode) => episode.embedIframeLink)
        ) || false
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-8" style={{ background: "#0E1015", border: "1px solid #1F232D" }}>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="rounded-2xl p-8" style={{ background: "#0E1015", border: "1px solid #1F232D" }}>
        <div className="text-center py-12 text-[#9CA3AF]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No content found.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0E1015", border: "1px solid #1F232D" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1F232D]">
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Content
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Language
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Year
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Embed Available
              </th>
              <th className="px-4 py-4 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F232D]">
            {content.map((item, index) => {
              const embedAvailable = checkEmbedAvailable(item);
              const itemId = item._id || item.id;

              return (
                <motion.tr
                  key={itemId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#1F232D]/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1F232D]">
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {item.type === "movie" ? (
                              <Film className="w-4 h-4 text-[#9CA3AF]" />
                            ) : (
                              <Tv className="w-4 h-4 text-[#9CA3AF]" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#F9FAFB] truncate max-w-[200px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          {item.type === "series"
                            ? `${item.seasons?.length || 0} season${
                                (item.seasons?.length || 0) !== 1 ? "s" : ""
                              }`
                            : item.duration || "Movie"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === "movie"
                          ? "bg-[#F5C542]/10 text-[#F5C542]"
                          : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      }`}
                    >
                      {item.type === "movie" ? (
                        <Film className="w-3 h-3" />
                      ) : (
                        <Tv className="w-3 h-3" />
                      )}
                      {item.type === "movie" ? "Movie" : "Series"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#9CA3AF]">{item.language}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#9CA3AF]">{item.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#9CA3AF]">{item.year}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        embedAvailable
                          ? "bg-[#22C55E]/10 text-[#22C55E]"
                          : "bg-[#6B7280]/10 text-[#6B7280]"
                      }`}
                    >
                      {embedAvailable ? (
                        <>
                          <Check className="w-3 h-3" />
                          Yes
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          No
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/${item.type === "movie" ? "watch" : "series/watch"}/${
                          item._id || item.id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-[#1F232D] text-[#9CA3AF] hover:text-[#F5C542] transition-colors"
                        title="View"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg hover:bg-[#1F232D] text-[#9CA3AF] hover:text-[#F5C542] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          deleteConfirm === itemId
                            ? "bg-red-500/20 text-red-500"
                            : "hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-500"
                        }`}
                        title={deleteConfirm === itemId ? "Confirm Delete" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
