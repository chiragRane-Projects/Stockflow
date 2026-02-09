"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BanknoteX, BarChartBig, Github, Globe, Linkedin, Lock, Mail, Package, PackageMinus, Shield } from "lucide-react";

export default function Home() {

  const features = [
    {
      id: 1,
      title: "Automated inventory reorder alert",
      icon: <PackageMinus size={18} />,
      description: "Once your stock reaches its threshold level, you get an alert to reorder the stock. The quantity decreases as per its sales."
    },
    {
      id: 2,
      title: "Cash drawer & Expense Management",
      icon: <BanknoteX size={18} />,
      description: "Manage your cash flow by logging in all cash in and cash out. This also would help owner tally the cash amount in drawer by end of the day."
    },
    {
      id: 3,
      title: "Reports & Analytics",
      icon: <BarChartBig size={18} />,
      description: "On basis of the expenses and income, four types of reports get generated. This helps owner to make plan of action on basis of reports generated."
    },
    {
      id: 4,
      title: "Role based security",
      icon: <Shield size={18} />,
      description: "Features are segregated as per roles, no user can access features which is not assigned to its role. This maintains privacy."
    }
  ]
  return (
    <>
      <div className="min-h-screen bg-zinc-100 text-zinc-800">
        <nav className="sticky flex items-center justify-between px-6 py-4 border-b">
          <span className="text-xl font-bold -tracking-tight">StockFlow</span>

          <Link href="/admin/auth/login">
            <Button variant="outline" className="gap-2 border-zinc-300 hover:bg-zinc-50">
              <Lock size={16} />
              Login
            </Button>
          </Link>
        </nav>

        <main className="border-b">
          <section className="px-6 py-20 md:py-32 max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">Master your Inventory <span className="text-zinc-400">with Precision</span></h1>

            <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Real-time visibility, stock alerts, and role-based security.
              An enterprise-grade system designed for the speed of modern commerce.
            </p>

            <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
              <Link href={"https://github.com/chiragRane-Projects"}>
                <Button>
                  <Github size={16} />
                  View source code
                </Button>
              </Link>

              <Link href={"https://chirag-v-rane.vercel.app/"}>
                <Button className={"bg-transparent text-zinc-700 hover:bg-transparent hover:border hover:border-zinc-600 transition-all duration-300"}>
                  <Globe size={16} />
                  Visit portfolio
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <main className="border-b">
          <div className="max-w-5xl mx-auto px-6 py-20 grid gap-8 md:grid-cols-2">
            {features.map((feat) => (
              <Card
                key={feat.id}
                className="group bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-zinc-900 text-white group-hover:scale-110 transition">
                      {feat.icon}
                    </div>

                    <CardTitle className="text-lg font-semibold">
                      {feat.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-0 text-zinc-600 leading-relaxed">
                  {feat.description}
                </CardContent>

                <CardFooter className={"p-0"}>
                  <Link href={"/admin/auth/login"}>
                    <Button className={"rounded-sm"}>
                      Checkout Its Free
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>

        <main className="p-6">
          <footer className="flex flex-col gap-4 md:flex-row justify-between items-center">
            <section className="text-center">
              <Link href={"https://chirag-v-rane.vercel.app/"} className="hover:underline transition-all duration-300">
                <p className="font-semibold text-xl">CHIRAG VAIBHAV RANE</p>
              </Link>
            </section>

            <section className="flex flex-row gap-3">
              <div>
                <Link href={"https://www.linkedin.com/in/chirag-v-rane/"}>
                  <Linkedin size={18} />
                </Link>
              </div>

              <div>
                <Link href={"https://github.com/chiragRane-Projects"}>
                  <Github size={18} />
                </Link>
              </div>

              <div>
                <Link href={"mailto:beingchirag6@gmail.com"}>
                  <Mail size={18} />
                </Link>
              </div>
            </section>

             <section>
              <p>© {new Date().getFullYear()} Stockflow. All rights reserved.</p>
            </section>
          </footer>
        </main>
      </div>
    </>
  )
}