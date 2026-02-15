"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface IframePlayerProps {
  embedIframeLink?: string;
  title?: string;
}

export default function IframePlayer({
  embedIframeLink,
  title = "Video Player",
}: IframePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!embedIframeLink) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0E1015 0%, #1a1d26 100%)",
          border: "2px solid #1F232D",
        }}
      >
        <div className="h-[240px] sm:h-[500px] flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(245, 197, 66, 0.2) 0%, rgba(245, 197, 66, 0.05) 100%)",
              border: "2px solid rgba(245, 197, 66, 0.3)",
            }}
          >
            <AlertTriangle className="w-10 h-10 text-[#F5C542]" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl font-bold text-[#F9FAFB] mb-2"
          >
            Watch link not available
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#9CA3AF] text-center max-w-md"
          >
            This content is currently unavailable for streaming. Please check back later or contact support.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-2xl overflow-hidden relative"
      style={{
        background: "#0E1015",
        border: "2px solid #1F232D",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 197, 66, 0.1)",
      }}
    >
      {/* Cinematic glow effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{
          boxShadow: "inset 0 0 60px rgba(245, 197, 66, 0.05)",
        }}
      />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0E1015] z-20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#F5C542] animate-spin mb-4" />
            <span className="text-[#9CA3AF] text-sm">Loading player...</span>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <div className="relative w-full h-[240px] sm:h-[500px]">
        <iframe
          src={embedIframeLink}
          title={title}
          width="100%"
          height="100%"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          onLoad={() => setIsLoading(false)}
          className="rounded-2xl"
          style={{
            background: "#0E1015",
            border: "none",
          }}
        />
      </div>
    </motion.div>
  );
}
