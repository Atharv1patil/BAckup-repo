"use client";
import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardProps {
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  selectedDepartment,
  setSelectedDepartment,
}) => {
  // Static placement history data (fallback)
  const placementHistory = [
    { year: "2020-2021", placements: 650 },
    { year: "2021-2022", placements: 800 },
    { year: "2022-2023", placements: 920 },
    { year: "2023-2024", placements: 950 },
  ];

  // State for dynamic backend data
  const [totalPlacements, setTotalPlacements] = useState<number>(0);
  const [branchPlacementData, setBranchPlacementData] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [branchStats, setBranchStats] = useState<{
    averageSalary: string;
    companiesCount: number;
  }>({
    averageSalary: "$0",
    companiesCount: 0,
  });

  // Metrics: total placements, companies, and average package are updated dynamically.
  const [metrics, setMetrics] = useState([
    {
      title: "Total Placements",
      value: "0",
      growth: "+15.2%", // static growth for demo
      icon: "fa-solid fa-briefcase",
    },
    {
      title: "Companies",
      value: "0",
      growth: "+8.7%", // static growth for demo
      icon: "fa-solid fa-building",
    },
    {
      title: "Average Package",
      value: "$0",
      growth: "+12.3%", // static growth for demo
      icon: "fa-solid fa-dollar-sign",
    },
  ]);

  // Static student data remains unchanged
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
      department: "Electrical Engineering",
      year: "4th",
      cgpa: "3.9",
      status: "Interviewing",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      department: "Mechanical Engineering",
      year: "3rd",
      cgpa: "3.7",
      status: "Searching",
    },
  ];

  // Fetch overall total placements from /api/branches/total
  useEffect(() => {
    fetch("http://localhost:5000/api/branches/total")
      .then((res) => res.json())
      .then((data) => {
        setTotalPlacements(data.totalPlacedStudents);
        setMetrics((prev) =>
          prev.map((m) =>
            m.title === "Total Placements"
              ? { ...m, value: data.totalPlacedStudents.toString() }
              : m
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching total placements:", error)
      );
  }, []);

  // Fetch branch placement data for pie chart from /api/placements
  useEffect(() => {
    fetch("http://localhost:5000/api/placements")
      .then((res) => res.json())
      .then((data) => {
        setBranchPlacementData(data);
      })
      .catch((error) =>
        console.error("Error fetching branch placement data:", error)
      );
  }, []);

  // Fetch branch stats (companiesCount and averageSalary) when selectedDepartment changes.
  useEffect(() => {
    // Map dropdown values to branch names
    let branchName = "";
    if (selectedDepartment === "cs") branchName = "Computer Science";
    else if (selectedDepartment === "ee")
      branchName = "Electrical Engineering";
    else if (selectedDepartment === "me")
      branchName = "Mechanical Engineering";
    else branchName = "Computer Science"; // default for "all" or unrecognized

    fetch(
      `http://localhost:5000/branch-stats/${encodeURIComponent(branchName)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBranchStats(data);
        setMetrics((prev) =>
          prev.map((m) => {
            if (m.title === "Companies") {
              return { ...m, value: data.companiesCount.toString() };
            }
            if (m.title === "Average Package") {
              return { ...m, value: data.averageSalary };
            }
            return m;
          })
        );
      })
      .catch((error) =>
        console.error("Error fetching branch stats:", error)
      );
  }, [selectedDepartment]);

  // Fetch historical placements from /api/placement-past/<branch_name>
  useEffect(() => {
    // Map dropdown values to branch names (same mapping as above)
    let branchName = "";
    if (selectedDepartment === "cs") branchName = "Computer Science";
    else if (selectedDepartment === "ee")
      branchName = "Electrical Engineering";
    else if (selectedDepartment === "me")
      branchName = "Mechanical Engineering";
    else branchName = "Computer Science";

    fetch(
      `http://localhost:5000/api/placement-past/${encodeURIComponent(
        branchName
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHistoricalData(data);
      })
      .catch((error) =>
        console.error("Error fetching historical placements:", error)
      );
  }, [selectedDepartment]);

  // Initialize ECharts for the historical trend chart and pie chart
  useEffect(() => {
    const trendChartEl = document.getElementById("trendChart");
    const pieChartEl = document.getElementById("pieChart");

    if (trendChartEl && pieChartEl) {
      const trendChart = echarts.init(trendChartEl);
      const pieChart = echarts.init(pieChartEl);

      // Use historicalData if available; else fallback to static placementHistory
      const trendData =
        historicalData && historicalData.length > 0
          ? historicalData
          : placementHistory;

          const trendOption = {
            tooltip: { trigger: "axis", formatter: "{b}: {c} Placements" },
            xAxis: {
              type: "category",
              data: trendData.map((item: any) => item.academicYear || item.year),
              name: "Academic Year",
            },
            yAxis: { 
              type: "value", 
              name: "Number of Placements",
              max: 1000  // fixed y-axis maximum set to 1000
            },
            series: [
              {
                data: trendData.map((item: any) => item.placedStudents || item.placements),
                type: "bar", // or "line" if you prefer a line chart
                itemStyle: { color: "#007BFF" },
                emphasis: { focus: "series" },
              },
            ],
          };
          

      // Branch-wise Placement Distribution Chart using dynamic data from API
      const pieOption = {
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: branchPlacementData.map((branch) => ({
              value: branch.placedStudents,
              name: branch.branch,
            })),
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

      const handleResize = () => {
        trendChart.resize();
        pieChart.resize();
      };

      window.addEventListener("resize", handleResize);
      return () => {
        trendChart.dispose();
        pieChart.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [branchPlacementData, historicalData]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="ee">Electrical Engineering</SelectItem>
              <SelectItem value="me">Mechanical Engineering</SelectItem>
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
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                <span className="text-green-500 text-sm">{metric.growth}</span>
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
          <h3 className="text-lg font-semibold mb-4">Historical Placements</h3>
          <div id="trendChart" style={{ height: "300px" }}></div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Branch-wise Placements</h3>
          <div id="pieChart" style={{ height: "300px" }}></div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Placements</h3>
          <Input type="search" placeholder="Search students..." className="max-w-xs" />
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
                    <Badge variant={student.status === "Placed" ? "default" : "secondary"}>
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
};

export default Dashboard;
