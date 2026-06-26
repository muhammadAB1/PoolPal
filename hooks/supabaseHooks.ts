import { useEffect, useState } from "react"
import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { supabase } from "@/lib/Supabase"
import { SignUpParams } from '@/lib/types'

WebBrowser.maybeCompleteAuthSession()

export function useSupabase() {
    const [user, setUser] = useState<any>(null)
    const [plan, setPlan] = useState<string | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const session = data.session

            setUser(session?.user ?? null)
            setAccessToken(session?.access_token ?? null)
            setPlan(session?.user?.user_metadata.plan ?? null)
            setLoading(false)
        })

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null)
                setAccessToken(session?.access_token ?? null)
                setPlan(session?.user?.user_metadata.plan ?? null)
                setLoading(false)
            })
        return () => subscription.unsubscribe()
    }, [])

    async function signInWithOAuth(
        { provider, country, language, measurement }:
            { provider: "google" | "apple", country?: string, language?: string, measurement?: string }) {

        const redirectTo = Linking.createURL("/")

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        })

        if (error || !data?.url) {
            return { data: null, error }
        }

        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo
        )

        if (result.type !== "success") {
            return { data: null, error: null }
        }

        const code = Linking.parse(result.url).queryParams?.code
        const authCode = Array.isArray(code) ? code[0] : code

        if (!authCode) {
            return { data: null, error: new Error("Missing OAuth code") }
        }

        const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(authCode)

        if (sessionError || !sessionData.session) {
            return { data: sessionData, error: sessionError }
        }

        if (country || language || measurement) {
            const { error: updateError } = await supabase.auth.updateUser({
                email: sessionData.session?.user?.email,
                data: {
                    plan: "free",
                    country,
                    language,
                    measurement,
                },
            })
            return { data: sessionData, error: updateError }
        }

        return { data: sessionData, error: null }

    }

    async function signInWithEmailAndPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        return { data, error }
    }

    async function signUp({ email, password, firstName, phone, country, language, measurement }: SignUpParams) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    plan: 'free',
                    first_name: firstName,
                    country: country,
                    language: language,
                    measurement: measurement,
                    phone: phone,
                },
            },
        })

        if (error) {
            console.log(error)
        }

        return { data, error }
    }

    async function logout() {
        const { error } = await supabase.auth.signOut()

        setUser(null)
        setAccessToken(null)

        return { error }
    }

    return {
        user,
        accessToken,
        plan,
        loading,
        signInWithGoogle: (country?: string, language?: string, measurement?: string) => signInWithOAuth({ provider: "google", country, language, measurement }),
        signInWithApple: (country?: string, language?: string, measurement?: string) => signInWithOAuth({ provider: "apple", country, language, measurement }),
        signInWithEmailAndPassword,
        signUp,
        logout,
    }
}