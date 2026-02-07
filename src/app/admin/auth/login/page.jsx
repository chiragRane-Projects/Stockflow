"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOff, Package } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import loginImage from "../../../../../public/login.jpg"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser } = useAuth();
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      toast.error("Invalid credentials");
      return;
    }

    await fetchUser();
    router.push("/orders")
  }
  return (
    <>
      <main className="grid min-h-screen md:grid-cols-2">
        <aside className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-16">
          <div className="space-y-8 text-center max-w-md">

            <div className="flex justify-center items-center gap-2 text-2xl font-bold">
              <Package />
              StockFlow
            </div>

            <h2 className="text-3xl font-semibold leading-tight">
              Manage your inventory effortlessly
            </h2>

            <p className="text-emerald-100 text-sm">
              Track stock, create orders and keep your business running smoothly.
            </p>

            <Image
              src={loginImage}
              alt="inventory"
              className="rounded-xl shadow-xl"
              priority
            />
          </div>
        </aside>

        <aside className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="space-y-6 p-8">
              <CardTitle className="text-2xl text-center">
                Login
              </CardTitle>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="space-y-2 relative">
                  <Label>Password</Label>
                  <Input type={hidePassword ? "password" : "text"} placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <button type="button" onClick={() => setHidePassword(!hidePassword)}
                    className="absolute right-3 top-9 text-muted-foreground"
                  >
                    {hidePassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <Button type="submit" className="w-full" >
                  <p>Login</p>
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  )
}