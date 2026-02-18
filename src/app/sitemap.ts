import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://cineprime.netlify.app";

  try {
    await connectDB();
    const contents = await Content.find({}, "type updatedAt").lean();

    const contentUrls = contents.map((content: any) => ({
      url: `${baseUrl}/${content.type}/${content._id}`,
      lastModified: content.updatedAt ? new Date(content.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/?type=movie`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/?type=series`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      ...contentUrls,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
