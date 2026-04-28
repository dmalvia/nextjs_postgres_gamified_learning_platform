"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeVideoProps {
  videoId: string; // YouTube video ID
  title?: string;
}

export function YouTubeVideo({ videoId, title }: YouTubeVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

  const handleFullscreen = () => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        <div className="relative pt-[56.25%]">
          <iframe
            src={embedUrl}
            title={title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white z-20"
          onClick={handleFullscreen}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Fullscreen
        </Button>
      </Card>

      {title && <h3 className="text-lg font-semibold">{title}</h3>}
    </div>
  );
}
