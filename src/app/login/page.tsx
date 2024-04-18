"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

const ProfileForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit } = useForm();

    const onSubmit = async (values: any) => {
        setIsLoading(true)
        if(values.username === 'testing' && values.password === 'testing'){
            setTimeout(() => { 
                router.push("/dashboard")
                setIsLoading(false)
            }, 1500)
        }
    }

    return (
        <div className="flex align-center justify-center w-full min-h-[100vh] ">
            <Card className="w-[350px] h-full m-auto">
                <CardHeader>
                    <CardTitle>Login  to your account</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                </form>
            </Card>
        </div>
    )
}

export default ProfileForm