import type { PostAuthRoute } from "@/hooks/useAuthScreenGuard"

import { isHotTubPool, spaSanitizerToPoolType } from "@/lib/pool"
import { supabase } from "@/lib/Supabase"
import { HotTubType, ManualChlorineStatus, NumberOfPoolUsers, OccupancyPattern, poolBasicUpdateProps, poolCleaningInsertProps, PoolEnvironment, poolEquipmentInsertProps, poolReminderInsertProps, poolSizeInsertProps, poolSurfaceInsertProps, PoolType, RentalActivity, SaltSystemStatus, SpaAttachmentType, SpaSanitizer, testReadingsInsertProps, UsageFrequency, UseType } from "@/lib/types"
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

async function upsertDetachedSpaPool({
    ownerUserId,
    parentId,
    detachedSpaName,
    previousDetachedSpaName,
    spaSanitizer,
}: {
    ownerUserId?: string
    parentId: string
    detachedSpaName: string
    previousDetachedSpaName?: string
    spaSanitizer?: SpaSanitizer
}) {
    const spaFields = {
        pool_type: spaSanitizerToPoolType(spaSanitizer),
        body_type: 'hot_tub' as const,
        parent_pool_id: parentId,
    }

    const { data: existing, error: existingError } = await supabase
        .from('pools')
        .select('id, pool_name')
        .eq('parent_pool_id', parentId)
        .maybeSingle()
    if (existingError) return existingError

    if (existing) {
        const keepCustomName =
            existing.pool_name !== previousDetachedSpaName && existing.pool_name !== detachedSpaName
        const { error: updateError } = await supabase
            .from('pools')
            .update({
                ...spaFields,
                ...(keepCustomName ? {} : { pool_name: detachedSpaName }),
            })
            .eq('id', existing.id)
        return updateError
    }

    const { error: insertError } = await supabase
        .from('pools')
        .insert({
            owner_user_id: ownerUserId,
            pool_name: detachedSpaName,
            ...spaFields,
        })
    return insertError
}

export function useSupabase() {

    const { user, setUser, refreshProfile } = useAuth();
    const { markPoolsStale } = usePool();

    async function signInWithOAuth(
        { provider }:
            { provider: "google" | "apple" }): Promise<OAuthResult> {

        const redirectTo = Linking.createURL("/")
        const { data, error } = await supabase.auth.signInWithOAuth({

            provider,
            options: {
                redirectTo,
                skipBrowserRedirect: true,
                queryParams: {
                    prompt: "select_account",
                },
            },
        })

        if (error || !data?.url) {
            return { data: null, redirectTo: null, error }
        }

        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo,
            { preferEphemeralSession: true },
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

        const isNewUser = await AsyncStorage.getItem('activePoolId') ? false : true;
        const postAuthRoute = isNewUser ? '/(onboarding)/pool-basics' : '/(tabs)/dashboard'

        return { data: sessionData, redirectTo: postAuthRoute, error: null }
    }

    async function signUpWithEmail(
        firstName: string,
        email: string,
        password: string,
    ): Promise<OAuthResult> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                },
            },
        })

        await AsyncStorage.removeItem('activePoolId')
        setUser(data.session?.user || null)

        if (error || !data.session) {
            return { data: null, redirectTo: null, error }
        }

        const isNewUser = await AsyncStorage.getItem('activePoolId') ? false : true;
        const postAuthRoute = isNewUser ? '/(onboarding)/pool-basics' : '/(tabs)/dashboard'

        return { data: { session: data.session }, redirectTo: postAuthRoute, error: null }
    }

    async function signInWithEmail(
        email: string,
        password: string,
    ): Promise<OAuthResult> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        await AsyncStorage.removeItem('activePoolId')
        setUser(data.session?.user || null)

        if (error || !data.session) {
            return { data: null, redirectTo: null, error }
        }

        const isNewUser = await AsyncStorage.getItem('activePoolId') ? false : true;
        const postAuthRoute = isNewUser ? '/(onboarding)/pool-basics' : '/(tabs)/dashboard'

        return { data: { session: data.session }, redirectTo: postAuthRoute, error: null }
    }

    async function saveAccountBasics({
        country,
        language,
        measurement,
    }: {
        country: string
        language: string
        measurement: string
    }) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                country,
                language,
                measurement,
            })
            .eq('id', user?.id)

        if (!error) await refreshProfile()
        return { data, error }
    }

    async function updateMeasurementPreference(measurement: 'us' | 'metric') {
        const { data, error } = await supabase
            .from('profiles')
            .update({ measurement })
            .eq('id', user?.id)

        if (!error) await refreshProfile()
        return { data, error }
    }

    async function logout() {

        const { error } = await supabase.auth.signOut()
        return { error }

    }

    async function poolBasicInsert({
        poolName,
        poolType,
        screened,
        useType,
        hasHotTub,
        spaAttachment,
        usageFrequency,
        numberOfUsers,
        saltSystemStatus,
        manualChlorine,
        spaSanitizer,
        occupancyPattern,
        unusedMonths,
        rentalActivity,
        activeMonths,
        detachedSpaName,
        previousDetachedSpaName,
        markStale = true,
        forceCreate = false,
    }: {
        poolName: string
        poolType?: PoolType
        screened?: PoolEnvironment | 'Unscreened'
        useType?: UseType
        hasHotTub?: HotTubType
        spaAttachment?: SpaAttachmentType
        usageFrequency?: UsageFrequency
        numberOfUsers?: NumberOfPoolUsers
        saltSystemStatus?: SaltSystemStatus
        manualChlorine?: ManualChlorineStatus
        spaSanitizer?: SpaSanitizer
        occupancyPattern?: OccupancyPattern
        unusedMonths?: string[]
        rentalActivity?: RentalActivity
        activeMonths?: string[]
        detachedSpaName?: string
        previousDetachedSpaName?: string
        markStale?: boolean
        forceCreate?: boolean
    }) {

        const id = forceCreate ? null : await AsyncStorage.getItem('activePoolId');
        const poolBasics = {
            pool_name: poolName,
            pool_type: poolType === 'Other' ? 'Chlorine' : poolType ?? null,
            pool_screen: screened ?? null,
            hot_tub_type: hasHotTub ?? null,
            spa_attachment: hasHotTub === 'Yes' ? spaAttachment ?? null : null,
            pool_use_type: useType ?? null,
            usage_frequency: usageFrequency ?? null,
            number_of_users: numberOfUsers ?? null,
            salt_system_status: poolType === 'Saltwater' ? saltSystemStatus ?? null : null,
            manual_chlorine_during_salt_failure:
                poolType === 'Saltwater' && saltSystemStatus === 'not_working' ? manualChlorine ?? null : null,
            standalone_spa_sanitizer:
                hasHotTub === 'Yes' && spaAttachment === 'Detached'
                    ? spaSanitizer === 'unknown' ? 'chlorine' : spaSanitizer ?? null
                    : null,
            occupancy_pattern: useType === 'VacationHome' ? occupancyPattern ?? null : null,
            seasonal_unused_months:
                useType === 'VacationHome' && occupancyPattern === 'seasonal' ? unusedMonths ?? [] : [],
            rental_activity: useType === 'ShortTermRental' ? rentalActivity ?? null : null,
            rental_active_months:
                useType === 'ShortTermRental' && rentalActivity === 'seasonal' ? activeMonths ?? [] : [],
        };

        const shouldCreateDetachedSpa =
            hasHotTub === 'Yes' && spaAttachment === 'Detached' && Boolean(detachedSpaName);

        if (id) {
            const { data, error } = await supabase
                .from('pools')
                .update(poolBasics)
                .eq('id', id)
                .select()
                .single()
            if (error) return { data, error }

            if (shouldCreateDetachedSpa && data && !isHotTubPool(data) && detachedSpaName) {
                const spaError = await upsertDetachedSpaPool({
                    ownerUserId: user?.id,
                    parentId: data.id,
                    detachedSpaName,
                    previousDetachedSpaName,
                    spaSanitizer,
                })
                if (spaError) {
                    if (markStale) markPoolsStale();
                    return { data, error: spaError }
                }
            }

            if (markStale) markPoolsStale();
            return { data, error }
        }

        else {
            const { data, error } = await supabase
                .from('pools')
                .insert({ owner_user_id: user?.id, body_type: 'pool', ...poolBasics })
                .select()
                .single();
            if (error) return { data, error }

            if (data) {
                await AsyncStorage.setItem('activePoolId', data.id);
            }

            if (shouldCreateDetachedSpa && data && detachedSpaName) {
                const spaError = await upsertDetachedSpaPool({
                    ownerUserId: user?.id,
                    parentId: data.id,
                    detachedSpaName,
                    previousDetachedSpaName,
                    spaSanitizer,
                })
                if (spaError) {
                    if (markStale) markPoolsStale();
                    return { data, error: spaError }
                }
            }

            if (markStale) markPoolsStale();
            return { data, error }
        }
    }

    async function poolBasicUpdate({ props, markStale = true }:
        { props: poolBasicUpdateProps, markStale?: boolean }) {

        const id = await AsyncStorage.getItem('activePoolId');

        const { data, error } = await supabase
            .from('pools')
            .update({ pool_condition: props.poolCondition })
            .eq('id', id);

        if (!error && markStale) markPoolsStale();
        return { data, error }

    }

    async function poolSizeInsert({ props, markStale = true }: { props: poolSizeInsertProps, markStale?: boolean }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            console.log(props)
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({
                        length: props.length ?? null,
                        width: props.width ?? null,
                        shallow_depth: props.shallowDepth ?? null,
                        deep_depth: props.deepDepth ?? null,
                        shape: props.shape === 'Kidney' ? 'Freeform' : props.shape,
                        gallons: props.gallons ?? props.volumeUsGallons ?? null,
                        measurement_unit: props.measurementUnit,
                        volume_us_gallons: props.volumeUsGallons ?? null,
                        volume_liters: props.volumeLiters ?? null,
                        volume_source: props.volumeSource ?? 'calculated',
                        freeform_sections: props.freeformSections ?? [],
                    })
                    .eq('id', id)
                if (!error && markStale) markPoolsStale();
                return { error }
            }

            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolEquipmentInsert({
        props,
        markStale = true,
    }: {
        props: poolEquipmentInsertProps
        /** Set false when the caller will refresh the provider itself (Pool tab Edit). */
        markStale?: boolean
    }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ filter_type: props.filterType, pump_type: props.pumpType, heater: props.heaterOption })
                    .eq('id', id)
                if (!error && markStale) markPoolsStale();
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        }
        catch (error) {
            return { error: error as Error }
        }
    }

    async function poolSurfaceInsert({
        props,
        markStale = true,
    }: {
        props: poolSurfaceInsertProps
        /** Set false when the caller will refresh the provider itself (Pool tab Edit). */
        markStale?: boolean
    }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ surface_type: props.surfaceType })
                    .eq('id', id)

                if (!error && markStale) markPoolsStale();
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function poolCleaningInsert({
        props,
        markStale = true,
    }: {
        props: poolCleaningInsertProps
        /** Set false when the caller will refresh the provider itself (Pool tab Edit). */
        markStale?: boolean
    }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                const { error } = await supabase
                    .from('pools')
                    .update({ cleaning_type: props.cleaningType })
                    .eq('id', id)
                if (!error && markStale) markPoolsStale();
                return { error }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }

    async function testReadingsInsert({ props, id }: { props: testReadingsInsertProps, id?: string }) {
        try {

            const poolId = await AsyncStorage.getItem('activePoolId');
            if (!poolId) {
                return { data: null, error: new Error('Pool ID not found') }
            }

            const readingRow = { pool_id: poolId, free_chlorine: props.free_chlorine, total_chlorine: props.total_chlorine, bromine: props.bromine, ph: props.ph, total_alkalinity: props.total_alkalinity, cyanuric_acid: props.cyanuric_acid, calcium_hardness: props.calcium_hardness, combined_chlorine: props.combined_chlorine, salt: props.salt, pool_status: props.pool_status, swimming_status: props.swimming_status, }

            if (id) {
                const { data, error } = await supabase
                    .from('test_reading')
                    .update(readingRow)
                    .eq('id', id)
                // .select('id')
                // .single()
                if (!error) markPoolsStale();
                return { data, error }
            }
            const { data, error } = await supabase
                .from('test_reading')
                .insert(readingRow)
                .select('id')
                .single()
            if (!error) markPoolsStale();
            return { data, error }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    }

    async function weeklyReminderInsert({ props }: { props?: poolReminderInsertProps }) {
        try {
            const id = await AsyncStorage.getItem('activePoolId');
            if (id) {
                if (props) {
                    const { data, error } = await supabase
                        .from('pools')
                        .update({ reminder_day: props.reminderDay, reminder_time: props.reminderTime })
                        .eq('id', id).select('id, profile_completion_score').single()
                    if (!error) markPoolsStale();
                    return { data, error }
                }
                else {
                    const { data, error } = await supabase
                        .from('pools')
                        .select('id, profile_completion_score')
                        .eq('id', id)
                        .single()

                    return { data, error }
                }
            }
            return { error: new Error('Pool ID not found') }
        } catch (error) {
            return { error: error as Error }
        }
    }
    return {
        signInWithGoogle: () => signInWithOAuth({ provider: "google" }),
        signUpWithEmail,
        signInWithEmail,
        saveAccountBasics,
        updateMeasurementPreference,
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




