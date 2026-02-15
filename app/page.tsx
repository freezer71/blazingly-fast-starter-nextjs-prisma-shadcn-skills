import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/metadata";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe,
  Command
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Command className="h-6 w-6" />
          <span className="font-bold inline-block">{siteConfig.name}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Button asChild size="sm">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none max-w-3xl">
                  {siteConfig.description}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to build your next big idea. Fast, secure, and ready to scale.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/register">
                    Start Building <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Built for Speed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our stack is carefully selected to provide the best developer experience and performance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-border p-6 rounded-xl bg-background">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Blazingly Fast</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Optimized with the latest Next.js 15 and React 19 for the best performance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border p-6 rounded-xl bg-background">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure by Default</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Authentication powered by Better Auth with email verification.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border p-6 rounded-xl bg-background">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Ready for Scale</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Database management with Prisma and PostgreSQL for solid foundations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center border border-border p-12 rounded-3xl bg-primary text-primary-foreground">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to get started?</h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Join hundreds of developers building amazing applications with {siteConfig.name}.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="px-8 mt-4">
                <Link href="/register">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
