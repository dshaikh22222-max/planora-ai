import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, organization, topic, preferredDate } = body ?? {};

  if (!name || !email || !topic) {
    return NextResponse.json({ error: "Name, email, and topic are required." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log("Consulting booking request (no email provider configured):", {
      name,
      email,
      organization,
      topic,
      preferredDate,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Planora AI <notifications@planora.ai>",
        to: "hello@planora.ai",
        reply_to: email,
        subject: `New consulting request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization ?? "—"}\nPreferred date: ${preferredDate ?? "—"}\n\nTopic:\n${topic}`,
      }),
    });

    if (!res.ok) throw new Error(`Resend responded with ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Failed to send consulting request email", err);
    return NextResponse.json({ error: "Could not send your request. Please email hello@planora.ai directly." }, { status: 502 });
  }
}
