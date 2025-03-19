"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { NotificationType } from "../../../../types1"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  notifications: NotificationType[]
  getNotificationIcon: (type: string) => string
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, notifications, getNotificationIcon }) => {
  return (
    <header className="bg-white h-16 border-b flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" className="!rounded-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </Button>
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="!rounded-button relative">
              <i className="fa-solid fa-bell"></i>
              {notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 mb-2 rounded-lg ${notification.read ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="flex items-start gap-3">
                    <i className={`fa-solid ${getNotificationIcon(notification.type)} text-xl mt-1`}></i>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Avatar className="h-8 w-8">
          <img src="https://public.readdy.ai/ai/img_res/06f7dc8cf98ce2b000efffa6493ada13.jpg" alt="User" />
        </Avatar>
      </div>
    </header>
  )
}

