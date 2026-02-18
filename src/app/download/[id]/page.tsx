"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, ArrowLeft, Clock } from "lucide-react";

export default function DownloadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadData, setDownloadData] = useState<{
    title: string;
    downloadLink: string;
    type: string;
  } | null>(null);

  const contentId = params.id as string;
  const contentType = searchParams.get("type") || "movie";

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const response = await fetch(`/api/content/${contentId}`);
        const data = await response.json();

        if (data.success && data.data) {
          const content = data.data;
          let downloadLink = "";

          if (contentType === "movie") {
            downloadLink = content.movieData?.downloadLink || "";
          } else if (contentType === "episode") {
            const seasonIndex = parseInt(searchParams.get("season") || "0");
            const episodeIndex = parseInt(searchParams.get("episode") || "0");
            const season = content.seasons?.[seasonIndex];
            const episode = season?.episodes?.[episodeIndex];
            downloadLink = episode?.downloadLink || "";
          }

          setDownloadData({
            title: content.title,
            downloadLink,
            type: content.type,
          });
        }
      } catch (error) {
        console.error("Error fetching download link:", error);
      }
    };

    if (contentId) {
      fetchDownloadLink();
    }
  }, [contentId, contentType, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (downloadData && !isReady) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [downloadData, isReady]);

  const handleDownload = () => {
    if (downloadData?.downloadLink) {
      window.open(downloadData.downloadLink, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Prime<span className="text-blue-500">Video</span>
        </h1>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10623591',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Download className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {downloadData?.title || "Download"}
          </h1>
          <p className="text-gray-400">
            Your download is ready
          </p>
        </div>

        <div className="mb-6 p-4 bg-[#252525] rounded-xl">
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Please wait</span>
          </div>
          <div className="w-full h-2 bg-[#333] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ 
                width: `${((30 - countdown) / 30) * 100}%` 
              }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Generating download link in {countdown} seconds...
          </p>
        </div>

        <div className="space-y-4">
          {isReady && downloadData?.downloadLink && (
            <button
              onClick={handleDownload}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              Download Now
            </button>
          )}

          {isReady && downloadData?.downloadLink && (
            <a
              href={downloadData.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 bg-[#1F232D] text-white rounded-xl font-medium hover:bg-[#1F232D]/80 transition-colors"
            >
              Alternative Download Link
            </a>
          )}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
