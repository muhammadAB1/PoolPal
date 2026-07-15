import type { PostAuthRoute } from "@/hooks/useAuthScreenGuard"

import { supabase } from "@/lib/Supabase"
import { poolBasicUpdateProps, poolCleaningInsertProps, poolEquipmentInsertProps, poolReminderInsertProps, poolSizeInsertProps, poolSurfaceInsertProps, PoolType, ScreenedType, testReadingsInsertProps, UseType } from "@/lib/types"
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

    const { poolId } = usePool();

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

        await AsyncStorage.removeItem('activePoolId')
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
        console.log(postAuthRoute)

        return { data: sessionData, redirectTo: postAuthRoute, error: null }
    }

    async function logout() {

        const { error } = await supabase.auth.signOut()
        return { error }

    }

    async function poolBasicInsert({ poolName, poolType, screened, useType }:
        { poolName: string, poolType?: PoolType, screened?: ScreenedType, useType?: UseType }) {

        const id = await AsyncStorage.getItem('activePoolId');
        if (id) {
            const { data, error } = await supabase
                .from('pools')
                .update({ pool_name: poolName, pool_type: poolType, pool_screen: screened, pool_use_type: useType })
                .eq('id', id)
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
                await AsyncStorage.setItem('activePoolId', data.id);
            }
            return { data, error }
        }
    }

    async function poolBasicUpdate({ props }:
        { props: poolBasicUpdateProps }) {

        const id = await AsyncStorage.getItem('activePoolId');

        const { data, error } = await supabase
            .from('pools')
            .update({ pool_condition: props.poolCondition })
            .eq('id', id);

        return { data, error }

    }

    async function poolSizeInsert({ props }: { props: poolSizeInsertProps }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ length: props.length, width: props.width, shallow_depth: props.shallowDepth, deep_depth: props.deepDepth, shape: props.shape, gallons: props.gallons })
                    .eq('id', id)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolEquipmentInsert({ props }: { props: poolEquipmentInsertProps }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ filter_type: props.filterType, pump_type: props.pumpType, heater: props.heaterOption })
                    .eq('id', id)
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
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ surface_type: props.surfaceType })
                    .eq('id', id)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolCleaningInsert({ props }: { props: poolCleaningInsertProps }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ cleaning_type: props.cleaningType })
                    .eq('id', id)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function testReadingsInsert({ props }: { props: testReadingsInsertProps }) {

        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ testing_preference: props.testing_preference, free_chlorine: props.free_chlorine, ph: props.ph, total_alkalinity: props.total_alkalinity, cyanuric_acid: props.cyanuric_acid, calcium_hardness: props.calcium_hardness, })
                    .eq('id', id)
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function weeklyReminderInsert({ props }: { props: poolReminderInsertProps }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ reminder_day: props.reminderDay, reminder_time: props.reminderTime })
                    .eq('id', id)
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
        testReadingsInsert,
        weeklyReminderInsert,
    }

}




