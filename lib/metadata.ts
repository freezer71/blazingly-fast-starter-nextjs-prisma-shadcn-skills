export const siteConfig = {
  name: "Acme Inc",
  description: "The blazingly fast starter for Next.js, Prisma, and Shadcn UI.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://acme.com/og.jpg",
  links: {
    twitter: "https://twitter.com/acme",
    github: "https://github.com/acme/starter",
  },
  logo: {
    url: "/next.svg", // Path to your logo in /public
    alt: "Acme Inc Logo",
  },
  contact: {
    email: "support@acme.com",
    address: "123 Main St, San Francisco, CA 94105",
  },
  emails: {
    from: "Acme <onboarding@resend.dev>",
  }
};

export type SiteConfig = typeof siteConfig;
