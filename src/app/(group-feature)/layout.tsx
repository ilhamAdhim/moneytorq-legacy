import { MainNav } from "@/components/composites/MainNav";
import TeamSwitcher from "@/components/composites/TeamSwitcher";
import ThemeSwitcher from "@/components/composites/ThemeSwitcher";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Box } from "@radix-ui/themes";
import Image from "next/image";
import { redirect } from "next/navigation";

interface ILayoutGroupFeature {
    children: React.ReactNode;
}

async function LayoutGroupFeature({ children }: ILayoutGroupFeature) {
    // All protected routes 
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <Box className="w-[150px]">
                            <Image
                                src={"/moneytorq.png"}
                                alt="supabase logo"
                                width={100}
                                height={100}
                                className="rounded-full mx-auto p-2"
                            />
                        </Box>
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                            <TeamSwitcher />
                            <ThemeSwitcher />
                            {/* <Search /> */}
                            {/* <UserNav /> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </div>

        </>
    );
}

export default LayoutGroupFeature;