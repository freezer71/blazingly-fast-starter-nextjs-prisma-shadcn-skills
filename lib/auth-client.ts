import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        adminClient(),
        inferAdditionalFields<typeof auth>()
    ]
})
