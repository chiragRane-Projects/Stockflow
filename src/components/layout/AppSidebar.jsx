"use client"
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar"
import RoleChanger from "./Sidebar"
import { useAuth } from "@/context/AuthContext"

export function AppSidebar() {
    const { user } = useAuth();

    return (
        <Sidebar className="border-r border-border">
            <SidebarHeader className="border-b border-border">
                <h1 className="font-semibold text-lg text-center">
                    Stockflow
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <RoleChanger role={user?.role} />
            </SidebarContent>
        </Sidebar>
    )
}