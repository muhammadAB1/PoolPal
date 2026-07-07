import type { PostAuthRoute } from "@/hooks/useAuthScreenGuard"

import { supabase } from "@/lib/Supabase"
import { poolBasicUpdateProps, PoolCondition, poolCleaningInsertProps, poolEquipmentInsertProps, poolSizeInsertProps, poolSurfaceInsertProps, PoolType, ScreenedType, UseType } from "@/lib/types"
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

    const { user, setUser } = useAuth();

    const { poolId, setPoolId } = usePool();

    async function signInWithOAuth(

        { provider, country, language, measurement }:
            { provider: "google" | "apple", country?: string, language?: string, measurement?: string }): Promise<OAuthResult> {

        const redirectTo = Linking.createURL("/")
        console.log('redirectTo:', redirectTo)
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

        setUser(sessionData.session?.user || null)

        if (sessionError || !sessionData.session) {
            return { data: null, redirectTo: null, error: sessionError }
        }

        const isNewUser = poolId ? false : true;

        if (isNewUser && (country || language || measurement)) {
            const { data, error: updateError } = await supabase.auth.updateUser({
                data: {
                    plan: "free",
                    country,
                    language,
                    measurement,
                },
            })

            setUser(data.user)

            if (updateError) {
                return { data: sessionData, redirectTo: null, error: updateError }
            }
        }

        const postAuthRoute = isNewUser ? '/(onboarding)/pool-basics' : '/(tabs)/dashboard'

        return { data: sessionData, redirectTo: postAuthRoute, error: null }
    }

    async function logout() {

        const { error } = await supabase.auth.signOut()
        return { error }

    }

    async function poolBasicInsert({ poolName, poolType, screened, useType }:
        { poolName: string, poolType?: PoolType, screened?: ScreenedType, useType?: UseType }) {

        if (poolId) {
            const { data, error } = await supabase
                .from('pools')
                .update({ pool_name: poolName, pool_type: poolType, pool_screen: screened, pool_use_type: useType })
                .eq('id', poolId)
                .select()
                .single()
            return { data, error }
        }
        else {

            const { data, error } = await supabase
                .from('pools')
                .insert({ owner_user_id: user?.id, pool_name: poolName, pool_type: poolType, pool_screen: screened, pool_use_type: useType })
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
            .update({ pool_condition: props.poolCondition })
            .eq('id', poolId);

        return { data, error }

    }

    async function poolSizeInsert({ props }: { props: poolSizeInsertProps }) {
        try {
            if (poolId) {
                const { error } = await supabase
                    .from('pools')
                    .update({ length: props.length, width: props.width, shallow_depth: props.shallowDepth, deep_depth: props.deepDepth, shape: props.shape, gallons: props.gallons })
                    .eq('id', poolId)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolEquipmentInsert({ props }: { props: poolEquipmentInsertProps }) {
        try {
            console.log(poolId)
            if (poolId) {
                const { error } = await supabase
                    .from('pools')
                    .update({ filter_type: props.filterType, pump_type: props.pumpType, heater: props.heaterOption })
                    .eq('id', poolId)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        }
        catch (error) {
            return { error: error as Error }
        }
    }

    async function poolSurfaceInsert({ props }: { props: poolSurfaceInsertProps }) {
        try {
            if (poolId) {
                const { error } = await supabase
                    .from('pools')
                    .update({ surface_type: props.surfaceType })
                    .eq('id', poolId)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolCleaningInsert({ props }: { props: poolCleaningInsertProps }) {
        try {
            if (poolId) {
                const { error } = await supabase
                    .from('pools')
                    .update({ cleaning_type: props.cleaningType })
                    .eq('id', poolId)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    return {
        signInWithGoogle: (country?: string, language?: string, measurement?: string) => signInWithOAuth({ provider: "google", country, language, measurement }),
        logout,
        poolBasicInsert,
        poolBasicUpdate,
        poolSizeInsert,
        poolEquipmentInsert,
        poolSurfaceInsert,
        poolCleaningInsert,
    }

}




