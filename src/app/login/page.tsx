
 import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
 } from "@/components/ui/card"
 import { redirect } from "next/navigation"
 import { createSupabaseServer } from "@/lib/supabase/server"
 import { headers } from "next/headers"

import SignIn from "@/components/supaauth/register";

 const ProfileForm = () => {
     const signIn = async (values: any) => {
         'use server'
         console.log("running")
        //   1. Create Supabase client
         const supabase = createSupabaseServer()
         const origin = headers().get('origin')
         console.log("origin", origin)

        //   2. Sign it with Github
         const { data, error } = await supabase.auth.signInWithOAuth({
             provider: "github",
             options: {
                 redirectTo: `${origin}/auth/callback`
             }
         })

         if (error) console.log(error)
         else {
             return redirect(data.url)
         }

        //   3. Redirect to Dashboard
     }

     return (
         <div className="flex align-center justify-center w-full min-h-[100vh] ">
             <Card className="w-[350px] h-full m-auto">
                 <CardHeader>
                     <CardTitle className="text-center">Login  to your account</CardTitle>
                     <CardDescription className="text-center">Deploy your new project in one-click.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <form action={signIn}>
                         <button type="submit" className="py-2 px-4 max-w-md flex justify-center items-center bg-gray-400 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                             <svg xmlns="http:www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792">
                                 <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                             </svg>
                             Sign in with GitHub
                         </button>
                     </form>

                 </CardContent>
                 {/* <form onSubmit={handleSubmit(onSubmit)}>
                     <CardContent>
                         <div className="grid w-full items-center gap-4">
                             <div className="flex flex-col space-y-1.5">
                                 <Label htmlFor="name">Username</Label>
                                 <Input id="username" placeholder="Input your username" {...register("username")} />
                             </div>
                             <div className="flex flex-col space-y-1.5">
                                 <Label htmlFor="password">Password</Label>
                                 <Input id="password" type="password" placeholder="Input your password" {...register("password")} />
                             </div>
                         </div>
                     </CardContent>
                     <CardFooter className="flex justify-between">
                         <Button type="reset" variant="outline">Reset</Button>
                         <Button disabled={isLoading} type="submit"> {isLoading ? "Loading..." : "Login"} </Button>
                     </CardFooter>
                 </form> */}
             </Card>
         </div>
     )
 }

 export default ProfileForm
