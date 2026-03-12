import AnnouncementBar from "@/components/navbar/AnnouncementBar"
import Navbar from "@/components/navbar/Navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>

      <AnnouncementBar/>

      <Navbar/>

      <main>{children}</main>

    </div>
  )
}