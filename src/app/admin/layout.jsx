"use client"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outfit } from "next/font/google"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const outfit = Outfit({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});


export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === "/admin/auth/login";

    useEffect(() => {
        if (loading) return;

        if (!user && !isLoginPage) {
            router.replace("/admin/auth/login");
        }

        if (user && isLoginPage) {
            router.replace("/admin/orders");
        }
    }, [user, loading, pathname, router])

    if (loading) return null;

    if(isLoginPage){
        return <div className={outfit.className}>{children}</div>
    }
    return (
        <>
            <div className={outfit.className}>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex items-center border-b px-4 h-11">
                            <SidebarTrigger/>
                        </header>

                        <div className="p-5">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </>
    )
}