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

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") || "movie";
    const season = parseInt(searchParams.get("season") || "0");
    const episode = parseInt(searchParams.get("episode") || "0");

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

    let downloadLink = "";

    if (type === "movie") {
      downloadLink = content.movieData?.downloadLink || "";
    } else if (type === "episode") {
      const seasonData = content.seasons?.[season];
      const episodeData = seasonData?.episodes?.[episode];
      downloadLink = episodeData?.downloadLink || "";
    }

    await Content.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          downloadLink,
          downloadCount: (content.downloadCount || 0) + 1,
          title: content.title,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating download link:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate download link",
      },
      { status: 500 }
    );
  }
}
