import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import AnnouncementBar from "@/components/navbar/AnnouncementBar"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/footer/Footer"
import Toaster from "@/components/ui/toaster"

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password"

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    })
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-slate-950">
      {!isAuthPage && <AnnouncementBar />}
      {!isAuthPage && <Navbar />}
      <main className="min-h-[calc(100vh-220px)]">{children}</main>
      {!isAuthPage && <Footer />}
      <Toaster />
    </div>
  )
}
