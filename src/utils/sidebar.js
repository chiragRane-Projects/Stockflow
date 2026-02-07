import { Banknote, BanknoteArrowDown, Box, ChartNoAxesColumn, HandCoins, LayoutDashboard, Package, Package2 } from "lucide-react";

export const sidebarMenu = [
    {
        title: "Dashboard",
        icon: <LayoutDashboard size={20}/>,
        path: "/dashboard",
        role: ["owner"]
    },
    {
        title: "Inventory",
        icon: <Package size={20}/>,
        path: "/inventory",
        role: ["owner", "staff"]
    },
    {
        title: "Order",
        icon: <Box size={20}/>,
        path: "/orders",
        role: ["owner", "staff"]
    },
    {
        title: "Reports",
        subitems: [
            {title: "Sales Reports", icon: <HandCoins size={20}/>, path: "/reports/sales"},
            {title: "Expense Reports", icon: <BanknoteArrowDown size={20}/>, path: "/reports/expenses"},
            {title: "Profit & Loss Report", icon: <ChartNoAxesColumn size={20}/>, path: "/reports/p&l"},
            {title: "Stock Report", icon:<Package2 size={20}/>, path: "/reports/stock"}
        ],
        role: ["owner"]
    },
    {
        title: "Cash Drawer",
        icon: <Banknote size={20}/>,
        path: "/cashDrawer",
        role: ["owner", "staff"]
    }
]