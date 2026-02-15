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
import Link from "next/link"
import { toast } from "sonner"
import { Command } from "lucide-react"
import { useState } from "react"

const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
})

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsPending(true)
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    }, {
      onSuccess: () => {
        toast.success("If an account exists with this email, you will receive a reset link.")
        form.reset()
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
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-balance text-muted-foreground mt-2">
            Enter your email address and we&apos;ll send you a link to reset your password.
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
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
