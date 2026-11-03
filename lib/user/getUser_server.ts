import { cache, use } from "react"
import { createClient } from "../supabase/server"


export const getUser = cache(async () => {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
})

