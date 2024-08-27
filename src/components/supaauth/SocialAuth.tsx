"use client";
import React, { Dispatch, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { SetStateAction } from "jotai/vanilla";
import LoaderCustom from "../composites/Modals/Loaders";

interface ISocial {
	redirectTo: string
	isLoading: boolean
	setIsLoading: Dispatch<SetStateAction<boolean>>
}

export default function Social({ redirectTo, isLoading, setIsLoading }: ISocial) {

	const loginWithProvider = async (provider: "github" | "google") => {
		setIsLoading(true)
		const supabase = createSupabaseBrowser();
		try {
			await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo:
						window.location.origin +
						`/auth/callback?next=` +
						redirectTo,
				},
			});

		} catch (error) {
			toast.error("Error occured")
		} finally {
			setIsLoading(false)
		}
	};

	return (
		<div className="w-full flex gap-2">
			<Button
				disabled={isLoading}
				className="w-full h-8 flex items-center gap-5"
				variant="outline"
				onClick={() => loginWithProvider("github")}
			>
				{isLoading ? <LoaderCustom /> :
					<>
						<IoLogoGithub />
						Github
					</>
				}
			</Button>
			<Button
				disabled={isLoading}
				className="w-full h-8 flex items-center gap-2"
				variant="outline"
				onClick={() => loginWithProvider("google")}
			>
				{isLoading ? <LoaderCustom /> :
					<>
						<FcGoogle />
						Google
					</>
				}
			</Button>
		</div>
	);
}
