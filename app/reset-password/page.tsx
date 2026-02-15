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
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Command } from "lucide-react"
import { useState, Suspense } from "react"

const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
        toast.error("Invalid or missing reset token.")
        return
    }

    setIsPending(true)
    await authClient.resetPassword({
        newPassword: values.password,
        token: token,
    }, {
        onSuccess: () => {
            toast.success("Password reset successfully. You can now login.")
            router.push("/login")
        },
        onError: (ctx) => {
             toast.error(ctx.error.message)
        }
    })
    setIsPending(false)
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">Invalid reset link. The token is missing.</p>
        <Button asChild variant="outline">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  )
}

import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center text-lg font-medium mb-2">
            <Command className="mr-2 h-6 w-6" />
            Acme Inc
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Reset password</h1>
          <p className="text-balance text-muted-foreground mt-2">
            Enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
