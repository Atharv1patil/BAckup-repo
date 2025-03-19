"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { NotificationType } from "../../../../types1"

interface NotificationsProps {
  notifications: NotificationType[]
  markAsRead: (id: number) => void
  deleteNotification: (id: number) => void
  getNotificationIcon: (type: string) => string
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  markAsRead,
  deleteNotification,
  getNotificationIcon,
}) => {
  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Button
              variant="outline"
              className="!rounded-button"
              onClick={() => notifications.forEach((n) => !n.read && markAsRead(n.id))}
            >
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Alert key={notification.id} className={`${notification.read ? "bg-gray-50" : "bg-white"} relative`}>
                  <div className="flex items-start gap-4">
                    <i className={`fa-solid ${getNotificationIcon(notification.type)} text-xl mt-1`}></i>
                    <div className="flex-1">
                      <AlertTitle className="text-lg font-semibold">{notification.title}</AlertTitle>
                      <AlertDescription className="mt-1 text-gray-600">{notification.message}</AlertDescription>
                      <p className="text-sm text-gray-400 mt-2">{notification.time}</p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-button"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <i className="fa-solid fa-check mr-2"></i>
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!rounded-button text-red-500 hover:text-red-600"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <i className="fa-solid fa-bell-slash text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">No notifications</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  )
}

