"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

interface SidebarProps {
  sidebarOpen: boolean
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, currentPage, setCurrentPage }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-[280px] bg-black text-white transition-all duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <img src="https://public.readdy.ai/ai/img_res/bcf73c10c79f3732d7ddab78ee0dfd4d.jpg" alt="Admin" />
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
  )
}

