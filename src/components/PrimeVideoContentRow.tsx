"use client";

import React, { useEffect, useRef, useState } from "react";
import { Content } from "@/types";
import PrimeVideoMovieCard from "./PrimeVideoMovieCard";

interface ContentRowProps {
  title: string;
  items: Content[];
  type: "movie" | "series";
}

export default function PrimeVideoContentRow({ title, items, type }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    checkScroll();
  }, [items]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 px-3 sm:px-0">{title}</h3>
      
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-[#0a0a0a] to-transparent w-10 sm:w-12 flex items-center justify-center transition-opacity hover:opacity-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
          </button>
        )}
        
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-3 sm:px-0 pb-2"
        >
          {items.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex-shrink-0 w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PrimeVideoMovieCard item={item} type={type} />
            </div>
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 bg-gradient-to-l from-[#0a0a0a] to-transparent w-10 sm:w-12 flex items-center justify-center transition-opacity hover:opacity-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight({ className }: { className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
