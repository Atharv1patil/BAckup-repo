"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { NotificationType } from "../../notification"

interface NotificationsPopupProps {
  notifications: NotificationType[]
  markNotificationAsRead: (id: number) => void
  setActiveTab: (tab: string) => void
  setShowNotifications: (show: boolean) => void
}

const NotificationsPopup: React.FC<NotificationsPopupProps> = ({
  notifications,
  markNotificationAsRead,
  setActiveTab,
  setShowNotifications,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job":
        return "fa-briefcase"
      case "interview":
        return "fa-calendar-check"
      case "profile":
        return "fa-user-edit"
      case "course":
        return "fa-graduation-cap"
      case "application":
        return "fa-file-alt"
      default:
        return "fa-bell"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-blue-100 text-blue-600"
      case "interview":
        return "bg-green-100 text-green-600"
      case "profile":
        return "bg-purple-100 text-purple-600"
      case "course":
        return "bg-yellow-100 text-yellow-600"
      case "application":
        return "bg-pink-100 text-pink-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="absolute top-16 right-6 w-96 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Notifications</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => {
            setActiveTab("notifications")
            setShowNotifications(false)
          }}
        >
          View All
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                !notification.read ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div
                className={`w-8 h-8 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}
              >
                <i className={`fa-solid ${getNotificationIcon(notification.type)} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                  {!notification.read && <Badge className="bg-blue-500 ml-2">New</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default NotificationsPopup

