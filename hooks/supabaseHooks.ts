import { supabase } from "@/lib/Supabase"
import { type User } from "@supabase/supabase-js"
import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { useEffect, useState } from "react"

WebBrowser.maybeCompleteAuthSession()

type SignUpParams = {
    email: string
    password: string
    firstName: string
    phone: string
}

function parseAuthParamsFromUrl(url: string): Record<string, string> {
    const params: Record<string, string> = {}
    const parsed = Linking.parse(url)

    if (parsed.queryParams) {
        for (const [key, value] of Object.entries(parsed.queryParams)) {
            if (typeof value === "string") {
                params[key] = value
            }
        }
    }

    const hashIndex = url.indexOf("#")
    if (hashIndex !== -1) {
        const hashParams = new URLSearchParams(url.substring(hashIndex + 1))
        hashParams.forEach((value, key) => {
            params[key] = value
        })
    }

    return params
}

async function createSessionFromUrl(url: string) {
    const params = parseAuthParamsFromUrl(url)

    if (params.access_token && params.refresh_token) {
        return supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
        })
    }

    if (params.code) {
        return supabase.auth.exchangeCodeForSession(params.code)
    }

    return { data: { session: null, user: null }, error: new Error("No auth params in URL") }
}

export function useSupabase() {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.log(error)
            }

            const session = data.session
            setUser(session?.user ?? null)
            setAccessToken(session?.access_token ?? null)
            setLoading(false)

            // Web-only redirect when no session (kept for reference):
            // if (!session) {
            //     window.history.pushState(null, '', '/auth');
            //     window.dispatchEvent(new PopStateEvent('popstate'));
            // }
        }

        init()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setAccessToken(session?.access_token ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    async function signInWithOAuth(provider: "google" | "apple") {
        const redirectTo = Linking.createURL("/")

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        })

        if (error) {
            console.log(error)
            return { data: null, error }
        }

        if (!data?.url) {
            return { data: null, error: new Error("No OAuth URL returned") }
        }

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

        if (result.type === "success") {
            return createSessionFromUrl(result.url)
        }

        return { data: null, error: null }
    }

    async function signUp({ email, password, firstName, phone }: SignUpParams) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    phone,
                },
            },
        })

        if (error) {
            console.log(error)
        }

        return { data, error }
    }

    // async function login() {
    //
    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: "google"
    //     })
    //
    //     if (error) {
    //         console.log(error)
    //     }
    //
    //     return { data, error }
    // }

    async function signInWithGoogle() {
        return signInWithOAuth("google")
    }

    async function signInWithApple() {
        return signInWithOAuth("apple")
    }

    async function logout() {

        const { error } = await supabase.auth.signOut()

        if (error) {
            console.log(error)
            return
        }

        setUser(null)
        setAccessToken(null)

        // Web-only redirect after logout (kept for reference):
        // window.location.href = "/auth"
    }

    return {
        user,
        accessToken,
        loading,
        signUp,
        signInWithGoogle,
        signInWithApple,
        logout,
    }
}
