"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { year: "2020", placements: 120 },
  { year: "2021", placements: 150 },
  { year: "2022", placements: 180 },
  { year: "2023", placements: 210 },
  { year: "2024", placements: 250 },
]

export default function PlacementStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement Statistics</CardTitle>
        <CardDescription>Placement trends over previous years</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Number of Placements", angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="placements" stroke="#8884d8" activeDot={{ r: 8 }} name="Placements" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-2">
        <p className="font-medium">{`Year: ${label}`}</p>
        <p className="text-primary">{`Placements: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

