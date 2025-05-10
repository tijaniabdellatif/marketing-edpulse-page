import { NextRequest, NextResponse } from "next/server";
import { generateLearningPath } from "@/server/ai/gemini";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { visitorId } = await request.json();

    if (!visitorId) {
      return NextResponse.json(
        { success: false, message: "Visitor ID is required" },
        { status: 400 }
      );
    }

    const learningPath = await generateLearningPath(visitorId);

    if (!learningPath) {
      throw new Error("Failed to generate learning path");
    }

    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
      select: { firstName: true, lastName: true },
    });

    if (!visitor) {
      return NextResponse.json(
        { success: false, message: `Visitor with ID ${visitorId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      learningPath,
      studentName: `${visitor.firstName} ${visitor.lastName}`,
    });
  } catch (error: any) {
    console.error("Error in learning path API:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate learning path",
      },
      { status: 500 }
    );
  }
}
