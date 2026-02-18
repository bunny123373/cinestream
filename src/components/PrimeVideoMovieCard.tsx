"use client";

import React from "react";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { Content } from "@/types";

interface MovieCardProps {
  item: Content | any;
  type: "movie" | "series";
}

export default function PrimeVideoMovieCard({ item, type }: MovieCardProps) {
  const isTmdbItem = !item._id && !item.id && item.poster_path;
  
  const hasContent = !isTmdbItem && (type === "movie" 
    ? !!item.movieData?.embedIframeLink 
    : (item.seasons && item.seasons.some((s: any) => s.episodes?.some((e: any) => e.embedIframeLink))));

  const link = isTmdbItem ? "#" : (type === "movie" 
    ? `/watch/${item._id || item.id}` 
    : `/series/${item._id || item.id}`);

  const title = item.title || item.name || "";
  const poster = item.poster || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "");
  const rating = item.rating ?? item.vote_average;
  const year = item.year || (item.release_date ? item.release_date.split("-")[0] : item.first_air_date?.split("-")[0]);

  return (
    <Link href={link}>
      <div className="relative rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-300 hover:scale-105 hover:z-10 group cursor-pointer">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {rating !== undefined && rating !== null && rating > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 flex items-center gap-1">
            <Star className="w-3 h-3 text-white fill-white" />
            <span className="text-white text-xs font-medium">{Number(rating).toFixed(1)}</span>
          </div>
        )}

        {hasContent && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
            <Play className="w-3 h-3 text-black fill-black" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <h4 className="font-medium text-white text-sm line-clamp-1">{title}</h4>
          <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
            <span>{year}</span>
            {item.category && (
              <>
                <span>•</span>
                <span>{item.category}</span>
              </>
            )}
            {isTmdbItem && (
              <>
                <span>•</span>
                <span>TMDB</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
