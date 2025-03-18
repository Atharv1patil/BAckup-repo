"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  activeTab: string
  unreadCount: number
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
}

const studentImage = "https://public.readdy.ai/ai/img_res/84e10cf703b2fe4ca541bc42e95edcfa.jpg"

const Header: React.FC<HeaderProps> = ({ activeTab, unreadCount, showNotifications, setShowNotifications }) => {
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Student Dashboard"
      case "profile":
        return "Edit Profile"
      case "skills":
        return "Skill Recommendations"
      case "notifications":
        return "Notifications"
      case "placement":
        return "Placement Overview"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold">{getTitle()}</h1>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="!rounded-button relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <i className="fa-solid fa-bell"></i>
          {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 bg-red-500">{unreadCount}</Badge>}
        </Button>

        <Avatar className="w-8 h-8">
          <img src={studentImage || "/placeholder.svg"} alt="Profile" className="object-cover" />
        </Avatar>
      </div>
    </header>
  )
}

export default Header

