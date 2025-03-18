"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NotificationType } from "../../notification"

interface NotificationsPageProps {
  notifications: NotificationType[]
  markNotificationAsRead: (id: number) => void
  markAllAsRead: () => void
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  markNotificationAsRead,
  markAllAsRead,
}) => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <Button variant="outline" className="!rounded-button" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              markNotificationAsRead={markNotificationAsRead}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface NotificationCardProps {
  notification: NotificationType
  markNotificationAsRead: (id: number) => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, markNotificationAsRead }) => {
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
    <Card
      className={`p-4 transition-all hover:shadow-md cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
      onClick={() => markNotificationAsRead(notification.id)}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center`}
        >
          <i className={`fa-solid ${getNotificationIcon(notification.type)}`}></i>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{notification.title}</h3>
            <span className="text-xs text-gray-500">{notification.time}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        {!notification.read && <Badge className="bg-blue-500">New</Badge>}
      </div>
    </Card>
  )
}

export default NotificationsPage

