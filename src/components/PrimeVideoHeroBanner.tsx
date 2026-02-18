"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Content } from "@/types";

interface HeroBannerProps {
  content: Content | null;
}

export default function HeroBanner({ content }: HeroBannerProps) {
  if (!content) return null;

  const contentType = content.movieData?.embedIframeLink ? "movie" : "series";
  const watchLink = contentType === "movie" 
    ? `/watch/${content._id || content.id}`
    : `/series/${content._id || content.id}`;

  return (
    <section className="relative h-[45vh] md:h-[55vh] lg:h-[85vh] min-h-[200px] md:min-h-[300px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {content.backdrop ? (
          <img
            src={content.backdrop}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : content.poster ? (
          <img
            src={content.poster}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : null}
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      <div className="relative h-full w-full flex items-end">
        <div className="w-full px-4 md:px-6 lg:px-8 pb-10 md:pb-14 lg:pb-24 max-w-7xl mx-auto">
          <div className="max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap">
              {content.rating !== undefined && content.rating !== null && (
                <span className="text-white font-medium text-xs md:text-sm">
                  ★ {Number(content.rating).toFixed(1)}
                </span>
              )}
              <span className="text-white text-xs md:text-sm">{content.year}</span>
              {content.duration && (
                <span className="text-white text-xs md:text-sm">{content.duration}</span>
              )}
              <span className="border border-white/30 text-white text-xs px-1.5 py-0.5">
                {content.language}
              </span>
              {content.movieData?.embedIframeLink && (
                <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-2 py-0.5">
                  HD
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight">
              {content.title}
            </h1>

            <p className="text-white/80 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <Link
                href={watchLink}
                className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white text-black font-bold rounded-sm hover:bg-white/90 transition-colors text-sm md:text-base"
              >
                <Play className="w-4 md:w-5 h-4 md:h-5 fill-black" />
                Play
              </Link>
              <Link
                href={watchLink}
                className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-sm hover:bg-white/20 transition-colors text-sm md:text-base"
              >
                <Info className="w-4 md:w-5 h-4 md:h-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
