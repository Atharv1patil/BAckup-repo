"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as echarts from "echarts"
import axios from "axios"

type UserData = {
  profile: {
    major: string;
  };
};

const recentActivities = [
  {
    id: 1,
    activity: "Applied for Software Engineer position at Amazon",
    time: "1 hour ago",
  },
  {
    id: 2,
    activity: "Completed Python Assessment",
    time: "3 hours ago",
  },
  {
    id: 3,
    activity: "Updated Resume",
    time: "1 day ago",
  },
]

const DashboardContent: React.FC = () => {
  // State to store data fetched from the backend
  const [placementData, setPlacementData] = useState<any[]>([])
  const [pieData, setPieData] = useState<{ placedStudents: number; totalStudents: number } | null>(null)
  // Set the branch to fetch data for
  const branch = "Computer Science"

  // Fetch dynamic data on mount
  useEffect(() => {
    fetchPlacementData()
    fetchPieData()
  }, [])

  // Initialize charts when data is available
  useEffect(() => {
    if (placementData.length && pieData) {
      initCharts()
    }
    return cleanupCharts
  }, [placementData, pieData])

  const fetchPlacementData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/placement-past/Computer Science`)
      setPlacementData(response.data)
    } catch (error) {
      console.error("Error fetching placement data:", error)
    }
  }
  const userData: UserData = JSON.parse(localStorage.getItem('userData')!);
  // console.log(userData.profile.major);

  const major1 = userData?.profile?.major;

  const fetchPieData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/student-stats/pie/${major1}`)
      setPieData(response.data)
    } catch (error) {
      console.error("Error fetching pie chart data:", error)
    }
  }

  // Initialize charts with dynamic data
  const initCharts = () => {
    const chartDom = document.getElementById("placementChart")
    const pieChartDom = document.getElementById("placementPieChart")

    // Line Chart - Placements Over Years
    if (chartDom) {
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: "Placements by Year",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          formatter: "Year: {b}<br />Placed Students: {c}",
        },
        xAxis: {
          type: "category",
          data: placementData.map((item) => item.academicYear),
          name: "Academic Year",
        },
        yAxis: {
          type: "value",
          name: "Students Placed",
        },
        series: [
          {
            data: placementData.map((item) => item.placedStudents),
            type: "line",
            smooth: true,
            color: "#2563eb",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(37, 99, 235, 0.8)" },
                { offset: 1, color: "rgba(37, 99, 235, 0.1)" },
              ]),
            },
          },
        ],
      }
      myChart.setOption(option)
    }

    // Pie Chart - Placement Status
    if (pieChartDom && pieData) {
      const pieChart = echarts.init(pieChartDom)
      const pieOption = {
        title: {
          text: "Placement Status",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            data: [
              {
                value: pieData.placedStudents,
                name: "Placed Students",
                itemStyle: { color: "#2563eb" },
              },
              {
                value: pieData.totalStudents - pieData.placedStudents,
                name: "Not Placed",
                itemStyle: { color: "#ef4444" },
              },
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
      }
      pieChart.setOption(pieOption)
    }
  }

  // Dispose of charts on cleanup
  const cleanupCharts = () => {
    const chartDom = document.getElementById("placementChart")
    const pieChartDom = document.getElementById("placementPieChart")
    if (chartDom) {
      const myChart = echarts.getInstanceByDom(chartDom)
      myChart?.dispose()
    }
    if (pieChartDom) {
      const pieChart = echarts.getInstanceByDom(pieChartDom)
      pieChart?.dispose()
    }
  }

  return (
    <main className="p-6">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Placement Progress</h3>
            <div id="placementChart" style={{ height: "300px"  }}></div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Placement Distribution</h3>
            <div id="placementPieChart" style={{ height: "300px" }}></div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </main>
  )
}

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
        <Progress value={55} className="mb-2" />
        <p className="text-sm text-gray-500">55% Complete</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Applied Jobs</h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
        <p className="text-sm text-gray-500">Last 30 days</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Upcoming Interviews</h3>
        <p className="text-3xl font-bold text-green-600">3</p>
        <p className="text-sm text-gray-500">Next week</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Skills Match</h3>
        <p className="text-3xl font-bold text-purple-600">92%</p>
        <p className="text-sm text-gray-500">Market demand</p>
      </Card>
    </div>
  )
}

export default DashboardContent
