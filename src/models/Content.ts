import mongoose, { Schema, Document } from "mongoose";

export interface IEpisode {
  episodeNumber: number;
  episodeTitle: string;
  embedIframeLink?: string;
  downloadLink: string;
  quality: string;
}

export interface ISeason {
  seasonNumber: number;
  episodes: IEpisode[];
}

export interface IMovieData {
  embedIframeLink?: string;
  downloadLink: string;
}

export interface IContent extends Document {
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
  movieData?: IMovieData;
  seasons?: ISeason[];
  createdAt: Date;
  updatedAt: Date;
}

const EpisodeSchema: Schema<IEpisode> = new Schema({
  episodeNumber: {
    type: Number,
    required: true,
  },
  episodeTitle: {
    type: String,
    required: true,
  },
  embedIframeLink: {
    type: String,
    default: null,
  },
  downloadLink: {
    type: String,
    required: true,
  },
  quality: {
    type: String,
    default: "HD",
  },
});

const SeasonSchema: Schema<ISeason> = new Schema({
  seasonNumber: {
    type: Number,
    required: true,
  },
  episodes: [EpisodeSchema],
});

const MovieDataSchema: Schema<IMovieData> = new Schema({
  embedIframeLink: {
    type: String,
    default: null,
  },
  downloadLink: {
    type: String,
    required: true,
  },
});

const ContentSchema: Schema<IContent> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["movie", "series"],
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    backdrop: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: null,
    },
    movieData: {
      type: MovieDataSchema,
      default: null,
    },
    seasons: {
      type: [SeasonSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);

export default Content;
