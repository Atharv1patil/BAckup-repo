"use client"

import type React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  unreadCount: number
}

interface UserData {
  profile: {
    firstName: string
    lastName: string
    major: string
  }
}

const studentImage = "https://public.readdy.ai/ai/img_res/84e10cf703b2fe4ca541bc42e95edcfa.jpg"

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadCount }) => {
  const navItems = [
    { id: "dashboard", icon: "fa-solid fa-house", label: "Dashboard" },
    { id: "profile", icon: "fa-solid fa-user", label: "Edit Profile" },
    // { id: "placement", icon: "fa-solid fa-chart-line", label: "Placement Overview" },
    { id: "skills", icon: "fa-solid fa-lightbulb", label: "Skill Recommendations" },
    { id: "notifications", icon: "fa-solid fa-bell", label: "Notifications", badge: unreadCount },
  ]

  const userData: UserData = JSON.parse(localStorage.getItem('userData') || '{}');
  const fullName = `${userData?.profile?.firstName} ${userData?.profile?.lastName}`;

const major1 = userData?.profile?.major;

  return (
    <div className="fixed w-64 h-screen bg-[#1a1a1a] text-white p-6">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-20 h-20 mb-4">
          <img src={studentImage || "/placeholder.svg"} alt="Student" className="object-cover" />
        </Avatar>
        <h3 className="text-lg font-semibold">{fullName}</h3>
        <p className="text-sm text-gray-400">{major1}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start text-left !rounded-button ${activeTab === item.id ? "bg-white/10" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
            {item.badge ? <Badge className="ml-auto bg-red-500">{item.badge}</Badge> : null}
          </Button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

