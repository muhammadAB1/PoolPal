import type { PostAuthRoute } from "@/hooks/useAuthScreenGuard"

import { supabase } from "@/lib/Supabase"
import { poolBasicUpdateProps, PoolCondition } from "@/lib/types"
import { useAuth } from "@/providers/AuthProvider"
import { usePool } from "@/providers/PoolProvider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession()

type OAuthResult = {

    data: { session: NonNullable<Awaited<ReturnType<typeof supabase.auth.exchangeCodeForSession>>['data']['session']> } | null

    redirectTo: PostAuthRoute | null

    error: Error | null

}

export function useSupabase() {

    const { user } = useAuth();

    const { poolId, setPoolId } = usePool();

    async function signInWithOAuth(

        { provider, country, language, measurement }:
            { provider: "google" | "apple", country?: string, language?: string, measurement?: string }): Promise<OAuthResult> {

        const redirectTo = Linking.createURL("/")
        const { data, error } = await supabase.auth.signInWithOAuth({

            provider,
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        })

        if (error || !data?.url) {
            return { data: null, redirectTo: null, error }
        }

        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo
        )

        if (result.type !== "success") {
            return { data: null, redirectTo: null, error: null }
        }

        const code = Linking.parse(result.url).queryParams?.code

        const authCode = Array.isArray(code) ? code[0] : code

        if (!authCode) {
            return { data: null, redirectTo: null, error: new Error("Missing OAuth code") }
        }

        const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(authCode)

        if (sessionError || !sessionData.session) {
            return { data: null, redirectTo: null, error: sessionError }
        }

        const isNewUser = poolId ? false : true;

        if (isNewUser && (country || language || measurement)) {
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    plan: "free",
                    country,
                    language,
                    measurement,
                },
            })

            if (updateError) {
                return { data: sessionData, redirectTo: null, error: updateError }
            }
        }

        const postAuthRoute = isNewUser ? '/pool-basics' : '/dashboard'

        return { data: sessionData, redirectTo: postAuthRoute, error: null }
    }

    async function logout() {

        const { error } = await supabase.auth.signOut()
        return { error }

    }

    async function poolBasicInsert({ poolName, poolType, screened, useType, profileCompletionScore }:
        { poolName: string, poolType: string, screened: string, useType: string, profileCompletionScore: number }) {

        if (poolId) {
            const { data, error } = await supabase
                .from('pools')
                .update({ pool_name: poolName, pool_type: poolType, pool_screen: screened, pool_use_type: useType, profile_completion_score: profileCompletionScore })
                .eq('id', poolId)
                .select()
                .single()
            return { data, error }
        }
        else {

            const { data, error } = await supabase
                .from('pools')
                .insert({ owner_user_id: user?.id, pool_name: poolName, pool_type: poolType, pool_screen: screened, pool_use_type: useType, profile_completion_score: profileCompletionScore })
                .select()
                .single();

            if (data) {
                setPoolId(data.id);
                await AsyncStorage.setItem('activePoolId', data.id);
            }
            return { data, error }
        }
    }

    async function poolBasicUpdate({ props }:
        { props: poolBasicUpdateProps }) {

        const { data, error } = await supabase
            .from('pools')
            .update({ pool_condition: props.poolCondition, profile_completion_score: props.profileCompletionScore })
            .eq('id', poolId);

        return { data, error }

    }

    return {
        signInWithGoogle: (country?: string, language?: string, measurement?: string) => signInWithOAuth({ provider: "google", country, language, measurement }),
        logout,
        poolBasicInsert,
        poolBasicUpdate,
    }

}




