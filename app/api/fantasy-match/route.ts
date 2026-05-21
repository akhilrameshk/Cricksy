/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Match id is required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/series-matches`, {
      cache: "no-store",
    });

    const json = await res.json();

    const match = (json.data || []).find((m: any) => m.id === id);

    if (!match) {
      return Response.json(
        { success: false, message: "Match not found", data: null },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: match,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to load match",
        data: null,
      },
      { status: 500 }
    );
  }
}
