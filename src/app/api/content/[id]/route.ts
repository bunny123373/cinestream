import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET single content by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content ID",
        },
        { status: 400 }
      );
    }

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found",
        },
        { status: 404 }
      );
    }

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
        message: "Failed to fetch content",
      },
      { status: 500 }
    );
  }
}

// PUT update content (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate type-specific fields
    if (body.type === "movie" && body.movieData) {
      if (!body.movieData.downloadLink) {
        return NextResponse.json(
          {
            success: false,
            message: "Movie downloadLink is required",
          },
          { status: 400 }
        );
      }
    } else if (body.type === "series" && body.seasons) {
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

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedContent,
        message: "Content updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content",
      },
      { status: 500 }
    );
  }
}

// DELETE content (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content ID",
        },
        { status: 400 }
      );
    }

    const deletedContent = await Content.findByIdAndDelete(id);

    if (!deletedContent) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Content deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content",
      },
      { status: 500 }
    );
  }
}
