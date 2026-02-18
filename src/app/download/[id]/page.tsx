"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, ArrowLeft, Loader2, ExternalLink, Megaphone } from "lucide-react";

const AD_URL = "https://omg10.com/4/10624270";

const DownloadCounter = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://3nbf4.com/act/files/tag.min.js?z=10624210";
    script.setAttribute("data-cfasync", "false");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null;
};

export default function DownloadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(15);
  const [progress, setProgress] = useState(100);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdWall, setShowAdWall] = useState(true);
  const [adClicked, setAdClicked] = useState(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloadLink();
  }, [contentId, contentType, searchParams]);

  useEffect(() => {
    if (!showAdWall && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newValue = prev - 1;
          setProgress((newValue / 15) * 100);
          return newValue;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (!showAdWall && countdown === 0) {
      setIsReady(true);
      setProgress(0);
    }
  }, [showAdWall, countdown]);

  const handleAdClick = () => {
    setAdClicked(true);
  };

  const handleDownload = () => {
    if (downloadData?.downloadLink) {
      window.open(downloadData.downloadLink, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAdWall) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <DownloadCounter />
        <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Megaphone className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {downloadData?.title || "Download"}
            </h1>
            <p className="text-gray-400">
              Support us by clicking the ad below
            </p>
          </div>

          <div className="mb-6">
            <a
              href={AD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAdClick}
              className="block w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-5 h-5" />
              Click Ad to Continue
            </a>
            <p className="text-xs text-gray-500 mt-2">
              Click the ad above to support us, then download will start automatically
            </p>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-500">
              After clicking the ad, this page will generate your download link
            </p>
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <DownloadCounter />
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-8 text-center">
        {adClicked && (
          <div className="mb-4 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">✓ Ad clicked! Generating download link...</p>
          </div>
        )}

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

        {!isReady ? (
          <div className="mb-6">
            <p className="text-gray-400 mb-4">
              Please wait while we generate your download link...
            </p>
            
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 - (351.86 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{countdown}</span>
                <span className="text-gray-400 text-xs">seconds</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {Math.round((countdown / 15) * 100)}% complete
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleDownload}
              disabled={!downloadData?.downloadLink}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              Download Now
            </button>
            
            {downloadData?.downloadLink && (
              <a
                href={downloadData.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium rounded-xl transition-colors"
              >
                Alternative Download Link
              </a>
            )}
          </div>
        )}

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
