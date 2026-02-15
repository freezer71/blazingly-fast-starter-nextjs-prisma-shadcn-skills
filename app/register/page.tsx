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

const registerSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
      lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {    message: "Password must be at least 8 characters.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsPending(true)
    await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.firstName, // Map firstName to name as configured in auth.ts
        lastName: values.lastName,
    }, {
        onSuccess: () => {
            toast.success("Account created! Please check your email to verify your account.")
            router.push("/login")
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
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-balance text-muted-foreground mt-2">
            Enter your information below to create your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
