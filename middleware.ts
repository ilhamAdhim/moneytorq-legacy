import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) return NextResponse.next()
    return NextResponse.redirect(new URL('/', req.url))
}

// See Matching Paths below to learn more

export const config = {
    matcher: ['/dashboard', '/transactions', '/budgeting']
}