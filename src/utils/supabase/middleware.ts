
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = (request: NextRequest) => {
  const cookieStore = cookies()
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
        get(name: string){
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions){
          cookieStore.set({name, value, ...options})
        },
        remove(name: string, options: CookieOptions){
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name, value: "",...options
          })

          const response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })

          response.cookies.set({
            name, value: "",...options
          })
        }
      },
    },
  );

  return { supabase, supabaseResponse}
};

