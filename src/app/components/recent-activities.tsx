import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileAlt, faBriefcase, faCode, faClock } from "@fortawesome/free-solid-svg-icons"


const activities = [
  {
    id: 1,
    icon: faBriefcase,
    title: "Applied at Amazon",
    description: "Software Engineer position",
    timestamp: "1 hour ago",
  },
  {
    id: 2,
    icon: faCode,
    title: "Python Assessment",
    description: "Completed coding challenge",
    timestamp: "3 hours ago",
  },
  {
    id: 3,
    icon: faFileAlt,
    title: "Resume Updated",
    description: "Updated work experience section",
    timestamp: "1 day ago",
  },
]

export default function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your recent placement-related activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FontAwesomeIcon 
                  icon={activity.icon} 
                  className="h-5 w-5 text-primary"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}