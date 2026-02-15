import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const tmdbId = searchParams.get("id");
    const type = searchParams.get("type") || "movie";

    console.log("TMDB Request:", { query, type, hasKey: !!TMDB_API_KEY });

    if (!TMDB_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: "TMDB_API_KEY not set in environment", 
        keyPresent: false 
      });
    }

    let url = "";
    if (tmdbId) {
      url = `${TMDB_BASE_URL}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
    } else if (query) {
      url = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
      console.log("TMDB URL:", url);
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Query parameter required" 
      });
    }

    const response = await fetch(url);
    const data = await response.json();

    console.log("TMDB Response status:", response.status);
    if (data.results) {
      console.log("TMDB Results count:", data.results.length);
    }

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.status_message || "TMDB API error",
        tmdbError: data 
      });
    }

    // Search results
    if (data.results) {
      const results = data.results.slice(0, 8).map((item: any) => ({
        tmdbId: item.id,
        title: item.title || item.name,
        overview: item.overview,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        rating: item.vote_average,
        releaseDate: item.release_date || item.first_air_date,
      }));
      return NextResponse.json({ success: true, data: { results } });
    }

    // Single result
    return NextResponse.json({ 
      success: true, 
      data: {
        tmdbId: data.id,
        title: data.title || data.name,
        overview: data.overview,
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
        rating: data.vote_average,
        releaseDate: data.release_date || data.first_air_date,
        genres: data.genres?.map((g: any) => g.name) || [],
      }
    });
  } catch (error) {
    console.error("TMDB API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
