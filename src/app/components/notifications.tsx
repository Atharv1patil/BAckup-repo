"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"

const allNotifications = [
  {
    id: 1,
    category: "placement",
    title: "Google Placement Drive",
    description: "Registration for Google placement drive is now open",
    timestamp: "2 hours ago",
    isUnread: true,
  },
  {
    id: 2,
    category: "academic",
    title: "Semester Results",
    description: "Your semester results have been announced",
    timestamp: "Yesterday",
    isUnread: true,
  },
  {
    id: 3,
    category: "placement",
    title: "Resume Shortlisted",
    description: "Your resume has been shortlisted for Microsoft",
    timestamp: "2 days ago",
    isUnread: true,
  },
  {
    id: 4,
    category: "academic",
    title: "Course Registration",
    description: "Course registration for next semester is now open",
    timestamp: "3 days ago",
    isUnread: false,
  },
  {
    id: 5,
    category: "placement",
    title: "Interview Result",
    description: "You have cleared the first round of Amazon interview",
    timestamp: "1 week ago",
    isUnread: false,
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const clearAllNotifications = () => {
    setNotifications(notifications.map((n) => ({ ...n, isUnread: false })))
  }

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => n.category === activeTab)

  const unreadCount = notifications.filter((n) => n.isUnread).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Your recent notifications</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllNotifications}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2">{unreadCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md ${notification.isUnread ? "bg-muted" : "bg-card"}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    {notification.isUnread && <span className="h-2 w-2 bg-primary rounded-full"></span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">{notification.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">No notifications to display</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

