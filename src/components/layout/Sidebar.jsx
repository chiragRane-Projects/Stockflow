"use client"
import { toast } from "sonner"
import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "../ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { sidebarMenu } from "@/utils/sidebar"
import { useState, useEffect } from "react"

export default function RoleChanger({ role }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

    if (!role) return null;

    const items = sidebarMenu.filter(item =>
        item.role.includes(role)
    );

    if (!items.length) return null;

    return isClient && (
        <RoleMenu role={role} items={items} pathname={pathname} />
    );
}


function RoleMenu({ role, items, pathname }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();

            toast.success("Logged out");

            router.replace("/admin/auth/login");
        } catch (error) {
            console.error(error)
            toast.error("Logout failed")
        }
    }

    const getInitials = (name = "User") =>
        name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()

    return (
        <div className="flex flex-col justify-between h-full">
            <SidebarGroup>
                <SidebarMenu>
                    <Accordion type="single" collapsible className="w-full">
                        {items.map(({ title, icon, path, subitems }) =>
                            subitems ? (
                                <AccordionItem value={title} key={title} className={"border-none"}>
                                    <AccordionTrigger className={"py-3 px-6 hover:bg-muted transition-colors duration-200"}>
                                        <div className="flex items-center gap-3">
                                            {icon}
                                            <span className="font-medium">
                                                {title}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0 ml-4">
                                        {subitems.map(({ subtitle, subicon, subpath }) => (
                                            <SidebarButton
                                                key={subpath}
                                                path={subpath}
                                                icon={subicon}
                                                isActive={pathname === subpath}
                                            >
                                                {subtitle}
                                            </SidebarButton>
                                        ))}
                                    </AccordionContent>

                                </AccordionItem>
                            ) : (
                                <SidebarButton
                                    key={path}
                                    path={path}
                                    icon={icon}
                                    isActive={pathname === path}
                                >

                                    {title}
                                </SidebarButton>
                            )
                        )}
                    </Accordion>
                </SidebarMenu>
            </SidebarGroup>

            <div className="border-t border-muted mt-4 px-6 py-4 flex flex-col items-center gap-3 text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer hover:opacity-80 transition w-12 h-12 border-2 border-primary/20 shadow-md hover:border-primary/40 hover:shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold text-lg">
                                {getInitials(user?.name || "User")}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center" sideOffset={8} className={"w-56 p-3 rounded-lg shadow-lg"}>
                        <div className="flex flex-col items-center text-sm text-foreground">
                            <p className="font-semibold text-base">{user?.name || "Unnamed User"}</p>
                            <p className="text-muted-foreground">{user?.username || "unknown"}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                                {user?.role || "user"}
                            </p>
                        </div>

                        <div className="border-t my-2"></div>

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer justify-center font-medium text-red-500 hover:text-red-600"
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <p className="text-[11px] text-muted-foreground mt-1">
                    Developed by <Link href={"https://chirag-v-rane.vercel.app/"}>
                        <span className="font-medium text-foreground underline">Chirag Rane</span></Link>
                </p>
            </div>
        </div>
    )
}

function SidebarButton({ path, isActive, icon, children }) {
    return (
        <Link href={path} className="w-full">
            <SidebarMenuButton
                className={`w-full rounded-lg transition-colors duration-200 ${isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-muted"
                    } gap-3 px-6 py-3`}
            >
                {icon}
                <span className="font-medium">{children}</span>
            </SidebarMenuButton>
        </Link>
    )
}