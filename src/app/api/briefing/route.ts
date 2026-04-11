import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { generateBriefingScript } from "@/lib/openai";
import { generateAudioBriefing, isElevenLabsConfigured } from "@/lib/elevenlabs";
import { trendsCollection, findInsightsByTrendIds } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trendIds, voiceId, format } = body;

    if (!trendIds?.length) {
      return NextResponse.json(
        { error: "trendIds are required" },
        { status: 400 }
      );
    }

    const objectIds = trendIds.map((id: string) => new ObjectId(id));
    const tCol = await trendsCollection();

    const [trends, insights] = await Promise.all([
      tCol.find({ _id: { $in: objectIds } }).toArray(),
      findInsightsByTrendIds(objectIds),
    ]);

    if (trends.length === 0) {
      return NextResponse.json(
        { error: "No trends found for provided IDs" },
        { status: 404 }
      );
    }

    const insightMap = new Map(
      insights.map((i) => [i.trendId.toString(), i])
    );

    const trendInputs = trends.map((t) => {
      const insight = insightMap.get(t._id.toString());
      return {
        name: t.name,
        growthRate: t.growthRate || 0,
        audience: insight?.audience?.demographic || "General consumers",
        topAction:
          insight?.businessActions?.[0]?.action || "Monitor this trend closely",
      };
    });

    // 1. Generate the briefing script via OpenAI
    const script = await generateBriefingScript(trendInputs);

    // 2. If format=script, or ElevenLabs isn't configured, return text only
    if (format === "script" || !isElevenLabsConfigured()) {
      return NextResponse.json({
        success: true,
        script,
        audioAvailable: false,
        elevenLabsConfigured: isElevenLabsConfigured(),
        trendCount: trends.length,
        characterCount: script.length,
      });
    }

    // 3. Generate audio via ElevenLabs
    const audioResult = await generateAudioBriefing(script, voiceId);

    if (audioResult) {
      // Return audio as a binary response
      return new NextResponse(new Uint8Array(audioResult.audio), {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `inline; filename="trendscope-briefing.mp3"`,
          "Content-Length": String(audioResult.audio.length),
          "X-Script-Length": String(audioResult.characterCount),
          "X-Voice-Id": audioResult.voiceId,
          "X-Model": audioResult.model,
        },
      });
    }

    // 4. ElevenLabs failed — return script as fallback
    return NextResponse.json({
      success: true,
      script,
      audioAvailable: false,
      message: "Audio generation failed. Returning script text as fallback.",
      trendCount: trends.length,
      characterCount: script.length,
    });
  } catch (error) {
    console.error("Briefing generation error:", error);
    return NextResponse.json(
      { error: "Briefing generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
