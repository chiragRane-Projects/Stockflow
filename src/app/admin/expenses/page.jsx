"use client"
import { getExpenses } from "@/services/expenseServices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react";
import CreateExpense from "@/components/expenses/CreateExpenseDialog";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); 

    useEffect(() => {
        fetchExpenses()
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data.expenses);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    

    const totalExpense = expenses.reduce(
        (sum, exp) => sum + exp.expenseAmount,
        0
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.expenseDate);
        expDate.setHours(0, 0, 0, 0);
        return expDate.getTime() === today.getTime();
    });
    
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.expenseAmount, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthExpenses = expenses.filter(exp => new Date(exp.expenseDate) >= startOfMonth);
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.expenseAmount, 0);
    
    const categoryTotals = expenses.reduce((acc, exp) => {
        const cat = exp.expenseDescription || 'Other';
        acc[cat] = (acc[cat] || 0) + exp.expenseAmount;
        return acc;
    }, {});
    
    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    

    if (loading) return (<>
        <div className="flex justify-center items-center flex-col gap-2">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading</p>
        </div>
    </>)

    const formatDate = (date) =>
        new Date(date).toISOString().split("T")[0];

    return (
        <>
            <div className="p-5 flex justify-between items-center">
                <p className="text-3xl font-semibold">Expenses Management</p>
                <CreateExpense onCreated={(newExpense) => setExpenses(prev => [...prev, newExpense])} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-6 mb-6">
                <Card className="border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight">
                            ₹ {totalExpense.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Today's Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight">
                            ₹ {todayTotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {todayExpenses.length} transaction(s)
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight">
                            ₹ {monthTotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {monthExpenses.length} transaction(s)
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Top Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold tracking-tight capitalize truncate">
                            {highestCategory ? highestCategory[0] : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            ₹ {highestCategory ? highestCategory[1].toLocaleString() : 0}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Table className={"border"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className={"text-center border-r text-lg"}>Expense Description</TableHead>
                        <TableHead className={"text-center border-r text-lg"}>Expense Amount</TableHead>
                        <TableHead className={"text-center border-r text-lg"}>Expense Date</TableHead>
                        <TableHead className={"text-center text-lg"}>Expense By</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {expenses.map((exp) => (
                        <TableRow key={exp._id}>
                            <TableCell className={"text-center text-lg capitalize border-r"}>{exp.expenseDescription}</TableCell>
                            <TableCell className={"text-center text-lg border-r"}>
                                ₹ {exp.expenseAmount}
                            </TableCell>

                            <TableCell className={"text-center text-lg border-r"}>
                                {formatDate(exp.expenseDate)}
                            </TableCell>
                            <TableCell className={"text-center text-lg capitalize"}>{exp.expenseBy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}