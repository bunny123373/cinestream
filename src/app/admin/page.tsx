"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Film,
  Tv,
  Plus,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";
import UploadMovieForm from "@/components/admin/UploadMovieForm";
import UploadSeriesForm from "@/components/admin/UploadSeriesForm";
import AdminContentTable from "@/components/admin/AdminContentTable";
import EditContentModal from "@/components/admin/EditContentModal";
import { Content } from "@/types";

type TabType = "movies" | "series" | "content";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for stored admin key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("adminKey");
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch content when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      localStorage.setItem("adminKey", adminKey);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setAdminKey("");
    setIsAuthenticated(false);
  };

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (item: Content) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/content/${item._id || item.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Content deleted successfully!");
        const itemId = item._id || item.id;
        setContent(prev => prev.filter(c => (c._id || c.id) !== itemId));
        setTimeout(() => fetchContent(), 500);
      } else {
        alert(data.message || "Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050608]" />
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F5C542]/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-[#F5C542]" />
            </div>
            <h1 className="text-2xl font-bold text-[#F9FAFB]">Admin Login</h1>
            <p className="text-[#9CA3AF] mt-2">
              Enter your admin key to access the dashboard
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
              border: "1px solid #1F232D",
            }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full px-4 py-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF]/50 focus:border-[#F5C542] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#F5C542] text-[#050608] rounded-xl font-semibold hover:bg-[#F5C542]/90 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
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
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-[#1F232D]" />
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F5C542]" />
                <span className="font-bold text-[#F9FAFB]">Admin Dashboard</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "content"
                ? "bg-[#F5C542] text-[#050608]"
                : "bg-[#0E1015] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#1F232D]"
            }`}
          >
            <Film className="w-4 h-4" />
            All Content
          </button>
          <button
            onClick={() => setActiveTab("movies")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "movies"
                ? "bg-[#F5C542] text-[#050608]"
                : "bg-[#0E1015] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#1F232D]"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Movie
          </button>
          <button
            onClick={() => setActiveTab("series")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "series"
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#0E1015] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#1F232D]"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Series
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F9FAFB]">
                  Manage Content
                </h2>
                <span className="text-sm text-[#9CA3AF]">
                  {content.length} item{content.length !== 1 ? "s" : ""}
                </span>
              </div>
              <AdminContentTable
                content={content}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            </motion.div>
          )}

          {activeTab === "movies" && (
            <motion.div
              key="movies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <UploadMovieForm
                adminKey={adminKey}
                onSuccess={() => {
                  fetchContent();
                  setActiveTab("content");
                }}
              />
            </motion.div>
          )}

          {activeTab === "series" && (
            <motion.div
              key="series"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <UploadSeriesForm
                adminKey={adminKey}
                onSuccess={() => {
                  fetchContent();
                  setActiveTab("content");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Edit Modal */}
      <EditContentModal
        content={editingContent}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingContent(null);
        }}
        onSave={() => {
          fetchContent();
          setIsEditModalOpen(false);
          setEditingContent(null);
        }}
        adminKey={adminKey}
      />
    </div>
  );
}
