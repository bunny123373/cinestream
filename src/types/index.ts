export interface Episode {
  episodeNumber: number;
  episodeTitle: string;
  embedIframeLink?: string;
  downloadLink: string;
  quality: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface MovieData {
  embedIframeLink?: string;
  downloadLink: string;
}

export interface Content {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  type: "movie" | "series";
  poster: string;
  backdrop?: string;
  language: string;
  category: string;
  year: number;
  rating?: number;
  duration?: string;
  movieData?: MovieData;
  seasons?: Season[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentResponse {
  success: boolean;
  data?: Content | Content[];
  message?: string;
}
