import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const providers: NextAuthOptions["providers"] = [
  EmailProvider({
    // `server` is required by the type but unused — sendVerificationRequest
    // below sends via the Resend API instead of SMTP.
    server: "",
    from: "Planora AI <notifications@planora.ai>",
    async sendVerificationRequest({ identifier: email, url }) {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        // No email provider configured — log the magic link so local/dev
        // sign-in still works without Resend set up.
        console.log(`Magic link for ${email}: ${url}`);
        return;
      }
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Planora AI <notifications@planora.ai>",
          to: email,
          subject: "Sign in to Planora AI",
          text: `Sign in to Planora AI: ${url}\n\nIf you didn't request this, you can ignore this email.`,
        }),
      });
    },
  }),
];

// Google sign-in only appears if credentials are configured — same
// "graceful when unconfigured" pattern used across the site.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/account",
  },
};
