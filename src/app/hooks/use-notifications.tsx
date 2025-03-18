"use client"

import { useState } from "react"
import type { NotificationType } from "../../notification"

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: "New Job Opening",
      message: "Google is hiring Software Engineers",
      time: "2 hours ago",
      type: "job",
      read: false,
    },
    {
      id: 2,
      title: "Interview Scheduled",
      message: "Microsoft technical round on March 20",
      time: "5 hours ago",
      type: "interview",
      read: false,
    },
    {
      id: 3,
      title: "Profile Update Required",
      message: "Please update your skills section",
      time: "1 day ago",
      type: "profile",
      read: false,
    },
    {
      id: 4,
      title: "New Course Recommendation",
      message: "Based on your profile: Advanced Cloud Computing",
      time: "2 days ago",
      type: "course",
      read: true,
    },
    {
      id: 5,
      title: "Application Status Update",
      message: "Your application at Amazon has moved to next round",
      time: "3 days ago",
      type: "application",
      read: true,
    },
  ])

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    markNotificationAsRead,
    markAllAsRead,
    unreadCount,
  }
}

