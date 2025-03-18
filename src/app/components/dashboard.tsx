"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import DashboardContent from "../components/dashboard-content"
import PlacementOverview from "../components/placement-overview"
import NotificationsPage from "../components/notifications-page"
import SkillsRecommendations from "../components/skills-recommendations"
import ProfileEditor from "../components/profile-editor"
import NotificationsPopup from "../components/notifications-popup"
import { useNotifications } from "../hooks/use-notifications"

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications, markNotificationAsRead, markAllAsRead, unreadCount } = useNotifications()

  const renderContent = () => {
    switch (activeTab) {
      case "placement":
        return <PlacementOverview />
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
            markAllAsRead={markAllAsRead}
          />
        )
      case "skills":
        return <SkillsRecommendations />
      case "profile":
        return <ProfileEditor />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />

      <div className="ml-64 flex-1">
        <Header
          activeTab={activeTab}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        {renderContent()}

        {showNotifications && (
          <NotificationsPopup
            notifications={notifications.slice(0, 4)}
            markNotificationAsRead={markNotificationAsRead}
            setActiveTab={setActiveTab}
            setShowNotifications={setShowNotifications}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard

