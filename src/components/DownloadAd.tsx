"use client";

import { useEffect } from "react";

const AD_SCRIPT_URL = "https://3nbf4.com/act/files/tag.min.js?z=10624210";

export default function DownloadAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = AD_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);
  return null;
}
