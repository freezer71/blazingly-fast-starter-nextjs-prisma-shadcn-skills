"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Command } from "lucide-react"

import { useState } from "react"

const loginSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isUnverified, setIsUnverified] = useState(false)
  const [email, setEmail] = useState("")
  const [isPending, setIsPending] = useState(false)
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setEmail(values.email)
    setIsPending(true)
    await authClient.signIn.email({
        email: values.email,
        password: values.password,
    }, {
        onSuccess: () => {
            toast.success("Logged in successfully")
            router.push("/")
        },
        onError: (ctx) => {
             if (ctx.error.status === 403 || ctx.error.message.includes("verify your email")) {
                 setIsUnverified(true)
                 toast.error("Please verify your email address before logging in.")
             } else {
                 toast.error(ctx.error.message)
             }
        }
    })
    setIsPending(false)
  }

  async function handleResendVerification() {
    setIsPending(true)
    await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/"
    }, {
        onSuccess: () => {
            toast.success("Verification email resent!")
        },
        onError: (ctx) => {
            toast.error(ctx.error.message)
        }
    })
    setIsPending(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center text-lg font-medium mb-2">
            <Command className="mr-2 h-6 w-6" />
            Acme Inc
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-balance text-muted-foreground mt-2">
            Enter your email below to login to your account
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Please wait..." : "Login"}
            </Button>
            {isUnverified && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2" 
                onClick={handleResendVerification}
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Resend verification email"}
              </Button>
            )}
          </form>
        </Form>
        
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
