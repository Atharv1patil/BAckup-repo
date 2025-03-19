"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface UserData {
  profile: {
    major: string;
  };
}

const PlacementOverview = () => {
  const [major, setMajor] = useState("Computer Science");
  const [placementData, setPlacementData] = useState({
    totalApplications: 0,
    interviewSuccess: 0,
    offersReceived: 0,
    averagePackage: 0,
    companiesVisited: [],
    salaryTrends: [],
  });

  const userData: UserData = JSON.parse(localStorage.getItem('userData') || '{}');

const major1 = userData?.profile?.major;
  useEffect(() => {
    axios
      .get(`http://localhost:5000/placement/${major1}`)
      .then((response) => {
        console.log("Fetched placement data:", response.data);
        setPlacementData(response.data);
      })
      .catch((error) => console.error("Error fetching placement data:", error));
  }, [major]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Placement Overview</h2>
      
      <div className="mb-4">
        {/* <select
          className="p-2 border rounded-md"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        >
          <option value="Computer Science">Computer Science</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
        </select> */}
      </div>

      <StatCards data={placementData} />
      <CompaniesVisited companies={placementData.companiesVisited} />
      <SalaryTrends trends={placementData.salaryTrends} />
    </div>
  );
};

interface PlacementData {
  totalApplications: number;
  interviewSuccess: number;
  offersReceived: number;
  averagePackage: number;
  companiesVisited: Company[];
  salaryTrends: SalaryTrend[];
}

const StatCards = ({ data }: { data: PlacementData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
        <p className="text-3xl font-bold text-blue-600">{data.totalApplications}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Interview Success</h3>
        <p className="text-3xl font-bold text-green-600">{data.interviewSuccess}%</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Offers Received</h3>
        <p className="text-3xl font-bold text-purple-600">{data.offersReceived}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Average Package</h3>
        <p className="text-3xl font-bold text-orange-600">${data.averagePackage}K</p>
      </Card>
    </div>
  );
};

interface Company {
  logo: string;
  name: string;
  roles: string[];
  dateVisited: string;
}

const CompaniesVisited = ({ companies }: { companies: Company[] }) => {
  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-6">Companies Visited</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-10 h-10">
                <img src={company.logo} alt={company.name} />
              </Avatar>
              <div>
                <h4 className="font-semibold">{company.name}</h4>
                <p className="text-sm text-gray-500">Roles: {company.roles.join(", ")}</p>
              </div>
              <p className="text-xs text-gray-500">Visited on {company.dateVisited}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

interface SalaryTrend {
  role: string;
  companies: string;
  range: string;
}

const SalaryTrends = ({ trends }: { trends: SalaryTrend[] }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Salary Trends</h3>
      <div className="space-y-6">
        {trends.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">{item.role}</h4>
              <p className="text-sm text-gray-500">{item.companies}</p>
            </div>
            <p className="font-semibold text-green-600">{item.range}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PlacementOverview;
