"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Skill {
  skillName: string
  skillType: string
  demandLevel: string
  courseLink: string
}

const SkillsRecommendations: React.FC = () => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("technical")
  const [skillsData, setSkillsData] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Replace with dynamic email if needed
        const response = await fetch('http://127.0.0.1:5000/profile-ai/johndoe@example.com')
        const data = await response.json()
        setSkillsData(data.recommended_skills)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  const filteredSkills = skillsData.filter(skill => 
    selectedSkillCategory === "technical" ? skill.skillType === "Hard Skill" : skill.skillType === "Soft Skill"
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Skill Recommendations</h2>
        <div className="flex space-x-4 mb-6">
          <Button
            variant={selectedSkillCategory === "technical" ? "default" : "outline"}
            className="!rounded-button"
            onClick={() => setSelectedSkillCategory("technical")}
          >
            Technical Skills
          </Button>
          <Button
            variant={selectedSkillCategory === "soft" ? "default" : "outline"}
            className="!rounded-button"
            onClick={() => setSelectedSkillCategory("soft")}
          >
            Soft Skills
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{skill.skillName}</h3>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={skill.demandLevel === "High" ? "destructive" : "default"} 
                    className="mr-2"
                  >
                    {skill.demandLevel} Demand
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="!rounded-button whitespace-nowrap"
                asChild
              >
                <a 
                  href={skill.courseLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-graduation-cap mr-2"></i>
                  View Course
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Learning Path</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Foundation', 'Advanced', 'Expert'].map((title, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <i className={`fa-solid fa-${index + 1} text-blue-600`}></i>
                </div>
                <div>
                  <h4 className="font-semibold">{title} Level</h4>
                  <p className="text-sm text-gray-500">
                    {index === 0 && "Core concepts and basics"}
                    {index === 1 && "Specialized knowledge"}
                    {index === 2 && "Industry-ready skills"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SkillsRecommendations