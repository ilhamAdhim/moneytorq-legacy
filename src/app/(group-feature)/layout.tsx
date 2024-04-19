import { MainNav } from "@/components/composites/main-nav";
import TeamSwitcher from "@/components/composites/team-switcher";
import { Search } from "lucide-react";

interface ILayoutGroupFeature {
    children: React.ReactNode;
}

function LayoutGroupFeature({ children }: ILayoutGroupFeature) {
    return (
    <>
        <div className="hidden flex-col md:flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <TeamSwitcher />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        {/* <UserNav /> */}
                    </div>
                </div>
            </div>
        </div>
        {children}
    </>
    );
}

export default LayoutGroupFeature;