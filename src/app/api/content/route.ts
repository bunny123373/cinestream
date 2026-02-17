import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export const dynamic = "force-dynamic";

// GET all content
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const language = searchParams.get("language");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort");

    let query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (language) {
      query.language = language;
    }

    if (category) {
      query.category = category;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    let contentQuery = Content.find(query).sort(sortOption);

    if (limit) {
      contentQuery = contentQuery.limit(parseInt(limit));
    }

    const content = await contentQuery.exec();

    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch content",
      },
      { status: 500 }
    );
  }
}

// POST new content (Admin only)
export async function POST(req: NextRequest) {
  try {
    // Verify admin key
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();

    // Validate required fields
    const requiredFields = ["title", "description", "type", "poster", "language", "category", "year"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate type-specific fields
    if (body.type === "movie") {
      if (!body.movieData?.embedIframeLink && !body.movieData?.downloadLink) {
        return NextResponse.json(
          {
            success: false,
            message: "Movie embedIframeLink or downloadLink is required",
          },
          { status: 400 }
        );
      }
    } else if (body.type === "series") {
      if (!body.seasons || body.seasons.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Series must have at least one season",
          },
          { status: 400 }
        );
      }

      // Validate each episode has downloadLink
      for (const season of body.seasons) {
        for (const episode of season.episodes) {
          if (!episode.downloadLink) {
            return NextResponse.json(
              {
                success: false,
                message: `Episode ${episode.episodeNumber} in Season ${season.seasonNumber} is missing downloadLink`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    const newContent = new Content(body);
    await newContent.save();

    return NextResponse.json(
      {
        success: true,
        data: newContent,
        message: "Content created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content",
      },
      { status: 500 }
    );
  }
}
