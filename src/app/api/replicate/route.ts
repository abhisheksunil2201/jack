import { generateReplicateInput } from "@/lib/replicate";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export const POST = async (req: NextRequest) => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not set" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const input = generateReplicateInput({ prompt: body.prompt });
    console.log(input);

    const res = await replicate.run("meta/meta-llama-3-8b-instruct", { input });
    return NextResponse.json(res, { status: 201 });

    // For now, return a success message
    // return NextResponse.json(
    //   { message: "Input processed successfully" },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
};
