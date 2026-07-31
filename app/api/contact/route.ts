import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, organization, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // No email provider configured yet — log server-side so nothing is lost
    // during development. Wire RESEND_API_KEY (or swap for SendGrid/SES) to
    // go live.
    console.log("Contact form submission (no email provider configured):", {
      name,
      email,
      organization,
      message,
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
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization ?? "—"}\n\n${message}`,
      }),
    });

    if (!res.ok) throw new Error(`Resend responded with ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Failed to send contact email", err);
    return NextResponse.json({ error: "Could not send your message. Please email hello@planora.ai directly." }, { status: 502 });
  }
}
