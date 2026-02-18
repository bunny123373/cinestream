"use client";

import { useEffect } from "react";

export default function AdOnClick() {
  useEffect(() => {
    let loaded = false;
    
    const loadAd = () => {
      if (loaded) return;
      loaded = true;
      
      const script = document.createElement("script");
      script.innerHTML = `(function(s){s.dataset.zone='10623591',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
      document.body.appendChild(script);
    };

    document.addEventListener("click", loadAd, { once: true });
    
    return () => {
      document.removeEventListener("click", loadAd);
    };
  }, []);

  return null;
}
