import { MainNav } from "@/components/composites/MainNav";
import TeamSwitcher from "@/components/composites/TeamSwitcher";
import ThemeSwitcher from "@/components/composites/ThemeSwitcher";
import { createSupabaseServer } from "@/lib/supabase/server";
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
                        <TeamSwitcher />
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
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