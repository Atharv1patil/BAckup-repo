// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState } from "react";
import * as echarts from "echarts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [notifications, setNotifications] = useState([
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
      message:
        "Your interview with Microsoft is scheduled for tomorrow at 2 PM",
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
  ]);
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
  });
  // Profile editing state
  const [editedProfile, setEditedProfile] = useState(profileData);
  const handleProfileUpdate = () => {
    setProfileData(editedProfile);
  };
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };
  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "fa-info-circle text-blue-500";
      case "success":
        return "fa-check-circle text-green-500";
      case "warning":
        return "fa-exclamation-triangle text-yellow-500";
      default:
        return "fa-bell text-gray-500";
    }
  };
  useEffect(() => {
    if (currentPage === "dashboard") {
      const trendChart = echarts.init(document.getElementById("trendChart"));
      const pieChart = echarts.init(document.getElementById("pieChart"));
      const trendOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 150, 180, 220, 260, 300],
            type: "line",
            smooth: true,
            color: "#007BFF",
          },
        ],
      };
      const pieOption = {
        animation: false,
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: [
              { value: 35, name: "Computer Science" },
              { value: 30, name: "Electrical" },
              { value: 25, name: "Mechanical" },
              { value: 10, name: "Civil" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      trendChart.setOption(trendOption);
      pieChart.setOption(pieOption);
      return () => {
        trendChart.dispose();
        pieChart.dispose();
      };
    }
  }, [currentPage]);
  const metrics = [
    {
      title: "Total Placements",
      value: "856",
      growth: "+12.5%",
      icon: "fa-solid fa-briefcase",
    },
    {
      title: "Active Students",
      value: "2,453",
      growth: "+5.2%",
      icon: "fa-solid fa-user-graduate",
    },
    {
      title: "Companies",
      value: "142",
      growth: "+8.7%",
      icon: "fa-solid fa-building",
    },
    {
      title: "Average Package",
      value: "$85,000",
      growth: "+15.3%",
      icon: "fa-solid fa-dollar-sign",
    },
  ];
  const students = [
    {
      id: 1,
      name: "Emily Thompson",
      department: "Computer Science",
      year: "4th",
      cgpa: "3.8",
      status: "Placed",
    },
    {
      id: 2,
      name: "Michael Chen",
      department: "Electrical",
      year: "4th",
      cgpa: "3.9",
      status: "Interviewing",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      department: "Mechanical",
      year: "3rd",
      cgpa: "3.7",
      status: "Searching",
    },
  ];
  const renderContent = () => {
    switch (currentPage) {
      case "notifications":
        return (
          <div className="p-6">
            <Card className="max-w-4xl mx-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Notifications</h2>
                  <Button
                    variant="outline"
                    className="!rounded-button"
                    onClick={() =>
                      setNotifications(
                        notifications.map((n) => ({ ...n, read: true })),
                      )
                    }
                  >
                    Mark all as read
                  </Button>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <Alert
                        key={notification.id}
                        className={`${notification.read ? "bg-gray-50" : "bg-white"} relative`}
                      >
                        <div className="flex items-start gap-4">
                          <i
                            className={`fa-solid ${getNotificationIcon(notification.type)} text-xl mt-1`}
                          ></i>
                          <div className="flex-1">
                            <AlertTitle className="text-lg font-semibold">
                              {notification.title}
                            </AlertTitle>
                            <AlertDescription className="mt-1 text-gray-600">
                              {notification.message}
                            </AlertDescription>
                            <p className="text-sm text-gray-400 mt-2">
                              {notification.time}
                            </p>
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
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
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
        );
      case "jobs":
        return (
          <div className="p-6">
            <Card className="max-w-6xl mx-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Available Jobs</h2>
                  <div className="flex gap-4">
                    <Input
                      type="search"
                      placeholder="Search jobs..."
                      className="w-[300px]"
                    />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="fulltime">Full Time</SelectItem>
                        <SelectItem value="intern">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active Jobs</TabsTrigger>
                    <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
                    <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            company: "Microsoft",
                            logo: "https://public.readdy.ai/ai/img_res/c40c10ed287ccd0025c04efb1173b7d1.jpg",
                            position: "Software Development Engineer",
                            location: "Redmond, WA",
                            type: "Full Time",
                            salary: "$120,000 - $180,000",
                            posted: "2 days ago",
                            deadline: "2025-04-15",
                            requirements: [
                              "5+ years of experience",
                              "BS/MS in Computer Science",
                              "Strong problem-solving skills",
                            ],
                            description:
                              "Join our dynamic team to build next-generation cloud solutions...",
                          },
                          {
                            id: 2,
                            company: "Apple",
                            logo: "https://public.readdy.ai/ai/img_res/bd37ee506b0fce2c1e3b701c457e6a27.jpg",
                            position: "iOS Developer",
                            location: "Cupertino, CA",
                            type: "Full Time",
                            salary: "$130,000 - $190,000",
                            posted: "1 week ago",
                            deadline: "2025-04-20",
                            requirements: [
                              "3+ years iOS development",
                              "Swift expertise",
                              "UI/UX knowledge",
                            ],
                            description:
                              "Create amazing experiences for Apple users worldwide...",
                          },
                          {
                            id: 3,
                            company: "Google",
                            logo: "https://public.readdy.ai/ai/img_res/2655e00abd1d3b8ee8ae299bad408b0e.jpg",
                            position: "Machine Learning Engineer",
                            location: "Mountain View, CA",
                            type: "Full Time",
                            salary: "$140,000 - $200,000",
                            posted: "3 days ago",
                            deadline: "2025-04-25",
                            requirements: [
                              "PhD in ML/AI preferred",
                              "TensorFlow expertise",
                              "Research experience",
                            ],
                            description:
                              "Work on cutting-edge AI/ML projects...",
                          },
                        ].map((job) => (
                          <Card key={job.id} className="p-6">
                            <div className="flex items-start gap-6">
                              <Avatar className="h-16 w-16">
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="object-cover"
                                />
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {job.position}
                                    </h3>
                                    <p className="text-gray-600">
                                      {job.company}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button className="!rounded-button">
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Job Details</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="flex items-start gap-4">
                                          <Avatar className="h-16 w-16">
                                            <img
                                              src={job.logo}
                                              alt={job.company}
                                              className="object-cover"
                                            />
                                          </Avatar>
                                          <div>
                                            <h3 className="text-xl font-semibold">
                                              {job.position}
                                            </h3>
                                            <p className="text-gray-600">
                                              {job.company}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="grid gap-2">
                                          <p className="text-sm text-gray-600">
                                            <i className="fa-solid fa-location-dot mr-2"></i>
                                            {job.location}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <i className="fa-solid fa-clock mr-2"></i>
                                            {job.type}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <i className="fa-solid fa-dollar-sign mr-2"></i>
                                            {job.salary}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            <i className="fa-solid fa-calendar-days mr-2"></i>
                                            Apply by {job.deadline}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">
                                            Requirements
                                          </h4>
                                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                            {job.requirements.map(
                                              (req, idx) => (
                                                <li key={idx}>{req}</li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">
                                            Description
                                          </h4>
                                          <p className="text-sm text-gray-600">
                                            {job.description}
                                          </p>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-4">
                                          <Button
                                            variant="outline"
                                            className="!rounded-button"
                                          >
                                            <i className="fa-regular fa-bookmark mr-2"></i>
                                            Save
                                          </Button>
                                          <Button className="!rounded-button">
                                            <i className="fa-solid fa-paper-plane mr-2"></i>
                                            Apply Now
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="fa-solid fa-location-dot"></i>
                                    {job.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="fa-solid fa-clock"></i>
                                    {job.type}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    {job.salary}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="fa-solid fa-calendar-days"></i>
                                    Posted {job.posted}
                                  </div>
                                </div>
                                <div className="flex gap-4 mt-4">
                                  <Badge variant="secondary">{job.type}</Badge>
                                  <Badge variant="outline">
                                    Apply by {job.deadline}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="applied">
                    <div className="text-center py-8 text-gray-500">
                      <i className="fa-solid fa-paper-plane text-4xl mb-2"></i>
                      <p>No jobs applied yet</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="saved">
                    <div className="text-center py-8 text-gray-500">
                      <i className="fa-regular fa-bookmark text-4xl mb-2"></i>
                      <p>No saved jobs</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        );
      case "dashboard":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              <div className="flex gap-4">
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ee">Electrical</SelectItem>
                    <SelectItem value="me">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{metric.title}</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {metric.value}
                      </h3>
                      <span className="text-green-500 text-sm">
                        {metric.growth}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className={`${metric.icon} text-blue-600 text-xl`}></i>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-lg font-semibold mb-4">Placement Trends</h3>
                <div id="trendChart" style={{ height: "300px" }}></div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Department Distribution
                </h3>
                <div id="pieChart" style={{ height: "300px" }}></div>
              </Card>
            </div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Placements</h3>
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Year</th>
                      <th className="text-left p-4">CGPA</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-4">{student.name}</td>
                        <td className="p-4">{student.department}</td>
                        <td className="p-4">{student.year}</td>
                        <td className="p-4">{student.cgpa}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              student.status === "Placed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {student.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        );
      case "students":
        return (
          <div className="p-6">
            <Card className="max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Student Profile</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="!rounded-button">
                      <i className="fa-solid fa-edit mr-2"></i>
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              email: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              phone: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          value={editedProfile.address}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="skills" className="text-right">
                          Skills
                        </Label>
                        <Textarea
                          id="skills"
                          value={editedProfile.skills}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              skills: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio" className="text-right">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={editedProfile.bio}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              bio: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleProfileUpdate}
                        className="!rounded-button"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <img
                        src="https://public.readdy.ai/ai/img_res/012ccb96306a8cb9ced2723a6bb69b38.jpg"
                        alt="Profile"
                      />
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">
                      {profileData.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {profileData.department}
                    </p>
                    <div className="w-full">
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">
                          Year: {profileData.year}
                        </p>
                        <p className="text-sm text-gray-600">
                          CGPA: {profileData.cgpa}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <i className="fa-solid fa-envelope mr-2"></i>
                          {profileData.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fa-solid fa-phone mr-2"></i>
                          {profileData.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fa-solid fa-location-dot mr-2"></i>
                          {profileData.address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Skills</h4>
                      <p className="text-sm text-gray-600">
                        {profileData.skills}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{profileData.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex h-screen bg-[#F5F7F9]">
      <div
        className={`fixed left-0 top-0 h-full w-[280px] bg-black text-white transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <img
                src="https://public.readdy.ai/ai/img_res/bcf73c10c79f3732d7ddab78ee0dfd4d.jpg"
                alt="Admin"
              />
            </Avatar>
            <div>
              <h3 className="font-semibold">Alexander Wright</h3>
              <p className="text-sm text-gray-400">Admin Director</p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          {["dashboard", "students", "notifications", "jobs"].map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={`w-full justify-start gap-3 mb-2 !rounded-button ${currentPage === item ? "bg-blue-600" : ""}`}
              onClick={() => setCurrentPage(item)}
            >
              <i
                className={`fa-solid fa-${
                  item === "dashboard"
                    ? "chart-line"
                    : item === "students"
                      ? "user-graduate"
                      : item === "notifications"
                        ? "bell"
                        : "briefcase"
                }`}
              ></i>
              <span className="capitalize">{item}</span>
            </Button>
          ))}
        </nav>
      </div>
      <div
        className={`flex-1 ${sidebarOpen ? "ml-[280px]" : "ml-0"} transition-all duration-300`}
      >
        <header className="bg-white h-16 border-b flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            className="!rounded-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </Button>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="!rounded-button relative"
                >
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
                        <i
                          className={`fa-solid ${getNotificationIcon(notification.type)} text-xl mt-1`}
                        ></i>
                        <div className="flex-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Avatar className="h-8 w-8">
              <img
                src="https://public.readdy.ai/ai/img_res/06f7dc8cf98ce2b000efffa6493ada13.jpg"
                alt="User"
              />
            </Avatar>
          </div>
        </header>
        <main className="p-6 min-h-[calc(100vh-4rem)]">{renderContent()}</main>
      </div>
    </div>
  );
};
export default App;



