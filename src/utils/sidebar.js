import { Banknote, BanknoteArrowDown, BarChart, Box, ChartNoAxesColumn, HandCoins, LayoutDashboard, Package, Package2, User } from "lucide-react";

export const sidebarMenu = [
    {
        title: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/admin/dashboard",
        role: ["owner"]
    },
    {
        title: "Inventory",
        icon: <Package size={20} />,
        path: "/admin/inventory",
        role: ["owner", "staff"]
    },
    {
        title: "Order",
        icon: <Box size={20} />,
        path: "/admin/orders",
        role: ["owner", "staff"]
    },
    {
        title: "Reports",
        icon: <BarChart size={20} />,
        subitems: [
            { subtitle: "Sales Report", subicon: <HandCoins size={20} />, subpath: "/admin/reports/sales" },
            { subtitle: "Expense Report", subicon: <BanknoteArrowDown size={20} />, subpath: "/admin/reports/expenses" },
            { subtitle: "Profit & Loss Report", subicon: <ChartNoAxesColumn size={20} />, subpath: "/admin/reports/p&l" },
            { subtitle: "Stock Report", subicon: <Package2 size={20} />, subpath: "/admin/reports/stock" }
        ],
        role: ["owner"]
    },
    {
        title: "Expenses",
        icon: <BanknoteArrowDown size={20} />,
        path: "/admin/expenses",
        role: ['owner']
    },
    {
        title: "Cash Drawer",
        icon: <Banknote size={20} />,
        path: "/admin/cashDrawer",
        role: ["owner", "staff"]
    },
    {
        title: "Users",
        icon: <User size={20} />,
        path: "/admin/users",
        role: ["owner"]
    },
]