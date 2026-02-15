import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/components/emails/verification-email";
import { siteConfig } from "./metadata";
import { admin } from "better-auth/plugins";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: siteConfig.emails.from,
        to: user.email,
        subject: `Reset your password - ${siteConfig.name}`,
        html: `<p>Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
      });
    },
  },
  plugins: [
    admin({
      defaultRole: "USER",
    }),
  ],
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const html = await render(VerificationEmail({
        url,
        userName: user.name
      }));

      await resend.emails.send({
        from: siteConfig.emails.from,
        to: user.email,
        subject: `Verify your email address - ${siteConfig.name}`,
        html: html,
      });
    },
  },
  user: {
    fields: {
      name: "firstName",
    },
    additionalFields: {
      lastName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
        transform: {
          input: (value) => (typeof value === "string" ? value.toUpperCase() : "USER"),
          output: (value) => value,
        }
      }
    },
  },
});
