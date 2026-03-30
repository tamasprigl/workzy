import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Új jelentkezés érkezett:", body);

    return NextResponse.json({
      success: true,
      message: "Jelentkezés sikeresen fogadva.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Hiba történt.",
      },
      { status: 500 }
    );
  }
}