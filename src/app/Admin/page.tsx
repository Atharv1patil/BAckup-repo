"use client"
import { useState } from "react"
import { Sidebar } from "./componets/sidebar1"
import { Header } from "./componets/header1"
import { Dashboard } from "./componets/dashboard1"
import { Notifications } from "./componets/notifications1"
import Jobs from "./componets/jobs1"
import { StudentProfile } from "./componets/student-profile1"
import type { NotificationType } from "../../../types1"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      type: "info",
      title: "New Job Opening",
      message: "Google has posted new software engineering positions",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Interview Scheduled",
      message: "Your interview with Microsoft is scheduled for tomorrow at 2 PM",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Profile Update Required",
      message: "Please update your resume before the upcoming placement drive",
      time: "1 day ago",
      read: true,
    },
  ])
  const [profileData, setProfileData] = useState({
    name: "Emily Thompson",
    email: "emily.thompson@university.edu",
    department: "Computer Science",
    year: "4th",
    cgpa: "3.8",
    phone: "+1 (555) 123-4567",
    address: "123 University Ave, College Town, ST 12345",
    skills: "Python, Java, React, Machine Learning",
    bio: "Passionate computer science student with interests in artificial intelligence and web development.",
  })

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "fa-info-circle text-blue-500"
      case "success":
        return "fa-check-circle text-green-500"
      case "warning":
        return "fa-exclamation-triangle text-yellow-500"
      default:
        return "fa-bell text-gray-500"
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            getNotificationIcon={getNotificationIcon}
          />
        )
      case "jobs":
        return <Jobs />
      case "dashboard":
        return <Dashboard selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} />
      case "students":
        return <StudentProfile profileData={profileData} setProfileData={setProfileData} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#F5F7F9]">
      <Sidebar sidebarOpen={sidebarOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className={`flex-1 ${sidebarOpen ? "ml-[280px]" : "ml-0"} transition-all duration-300`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          getNotificationIcon={getNotificationIcon}
        />
        <main className="p-6 min-h-[calc(100vh-4rem)]">{renderContent()}</main>
      </div>
    </div>
  )
}

