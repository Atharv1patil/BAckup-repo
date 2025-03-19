"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProfileDataType } from "../../../../types1"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "./use-toast"
import { Download, Lock, Unlock } from "lucide-react"


interface StudentProfileProps {
  profileData: ProfileDataType
  setProfileData: (data: ProfileDataType) => void
}


// Extended student data with more fields
interface StudentData extends ProfileDataType {
  id: string
  status: string
  enrollmentDate: string
  expectedGraduation: string
  placementStatus: string
  blocked?: boolean
}


// API URL - replace with your actual backend URL
const API_URL = "http://localhost:5000"


export const StudentProfile: React.FC<StudentProfileProps> = ({ profileData, setProfileData }) => {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const { toast } = useToast()


  const [newStudent, setNewStudent] = useState<Partial<StudentData>>({
    name: "",
    email: "",
    department: "Computer Science",
    year: "1st",
    cgpa: "",
    phone: "",
    address: "",
    skills: "",
    bio: "",
    status: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
    expectedGraduation: "",
    placementStatus: "Not Started",
    blocked: false,
  })


  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/students`)


        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }


        const data = await response.json()
        setStudents(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load students. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }


    fetchStudents()
  }, [toast])


  // Filter students based on search term and department
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toString().includes(searchTerm)


    const matchesDepartment =
      departmentFilter === "all" || student.department.toLowerCase().includes(departmentFilter.toLowerCase())


    return matchesSearch && matchesDepartment
  })


  // Handle student selection
  const handleSelectStudent = (student: StudentData) => {
    setSelectedStudent(student)
  }


  // Handle student update
  const handleUpdateStudent = async (updatedStudent: StudentData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/students/${updatedStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      })


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }


      // Update local state
      setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
      setSelectedStudent(null)


      toast({
        title: "Success",
        description: "Student profile updated successfully",
      })
    } catch (err) {
      console.error("Error updating student:", err)
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  // Handle student deletion
  const handleDeleteStudent = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      })


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }


      // Update local state
      setStudents(students.filter((s) => s.id !== id))
      if (selectedStudent?.id === id) {
        setSelectedStudent(null)
      }


      toast({
        title: "Success",
        description: "Student deleted successfully",
      })
    } catch (err) {
      console.error("Error deleting student:", err)
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  // Handle adding a new student
  const handleAddStudent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      })


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }


      const result = await response.json()


      // Create a new student object with the returned ID
      const studentToAdd = {
        ...newStudent,
        id: result.id,
      } as StudentData


      // Update local state
      setStudents([...students, studentToAdd])
      setIsAddingStudent(false)


      // Reset form
      setNewStudent({
        name: "",
        email: "",
        department: "Computer Science",
        year: "1st",
        cgpa: "",
        phone: "",
        address: "",
        skills: "",
        bio: "",
        status: "Active",
        enrollmentDate: new Date().toISOString().split("T")[0],
        expectedGraduation: "",
        placementStatus: "Not Started",
        blocked: false,
      })


      toast({
        title: "Success",
        description: "New student added successfully",
      })
    } catch (err) {
      console.error("Error adding student:", err)
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  // Handle blocking/unblocking a student
  const handleToggleBlockStudent = async (student: StudentData) => {
    try {
      setLoading(true)
      const updatedStudent = { ...student, blocked: !student.blocked }


      const response = await fetch(`${API_URL}/students/${student.id}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocked: !student.blocked }),
      })


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }


      // Update local state
      setStudents(students.map((s) => (s.id === student.id ? updatedStudent : s)))


      if (selectedStudent?.id === student.id) {
        setSelectedStudent(updatedStudent)
      }


      toast({
        title: "Success",
        description: `Student ${updatedStudent.blocked ? "blocked" : "unblocked"} successfully`,
      })
    } catch (err) {
      console.error("Error toggling student block status:", err)
      toast({
        title: "Error",
        description: "Failed to update student block status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  // Export student data to Excel
  const exportToExcel = () => {
    try {
      // Create CSV content
      const headers = ["Name", "Department", "Year", "CGPA", "Status", "Placement Status"]
      let csvContent = headers.join(",") + "\n"


      filteredStudents.forEach((student) => {
        const row = [
          `"${student.name}"`, // Wrap in quotes to handle names with commas
          `"${student.department}"`,
          `"${student.year}"`,
          student.cgpa,
          `"${student.status}"`,
          `"${student.placementStatus}"`,
        ]
        csvContent += row.join(",") + "\n"
      })


      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })


      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `student_data_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)


      toast({
        title: "Success",
        description: "Student data exported successfully",
      })
    } catch (err) {
      console.error("Error exporting data:", err)
      toast({
        title: "Error",
        description: "Failed to export student data. Please try again.",
        variant: "destructive",
      })
    }
  }


  return (
    <div className="p-6">
      <Card className="max-w-7xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Student Management</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={exportToExcel}>
                <Download size={16} />
                Export to Excel
              </Button>
              <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                <DialogTrigger asChild>
                  <Button className="!rounded-button">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add New Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="new-name"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            email: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-department" className="text-right">
                        Department
                      </Label>
                      <Select
                        value={newStudent.department}
                        onValueChange={(value) =>
                          setNewStudent({
                            ...newStudent,
                            department: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-year" className="text-right">
                        Year
                      </Label>
                      <Select
                        value={newStudent.year}
                        onValueChange={(value) =>
                          setNewStudent({
                            ...newStudent,
                            year: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-cgpa" className="text-right">
                        CGPA
                      </Label>
                      <Input
                        id="new-cgpa"
                        value={newStudent.cgpa}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            cgpa: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="new-phone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            phone: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-enrollment" className="text-right">
                        Enrollment Date
                      </Label>
                      <Input
                        id="new-enrollment"
                        type="date"
                        value={newStudent.enrollmentDate}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            enrollmentDate: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-graduation" className="text-right">
                        Expected Graduation
                      </Label>
                      <Input
                        id="new-graduation"
                        type="date"
                        value={newStudent.expectedGraduation}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            expectedGraduation: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingStudent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudent} disabled={loading}>
                      {loading ? "Adding..." : "Add Student"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>


          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                <SelectItem value="Business">Business Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {loading && students.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <i className="fa-solid fa-circle-exclamation text-4xl mb-2"></i>
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>


              <TabsContent value="table">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Placement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id} className={student.blocked ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{student.id.substring(0, 8)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {student.name}
                                {student.blocked && (
                                  <Badge variant="destructive" className="ml-1">
                                    Blocked
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{student.department}</TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell>{student.cgpa}</TableCell>
                            <TableCell>
                              <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  student.placementStatus === "Placed"
                                    ? "default"
                                    : student.placementStatus === "Interviewing"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {student.placementStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleSelectStudent(student)}
                                  disabled={loading}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${student.blocked ? "text-green-500 hover:text-green-600" : "text-amber-500 hover:text-amber-600"}`}
                                  onClick={() => handleToggleBlockStudent(student)}
                                  disabled={loading}
                                  title={student.blocked ? "Unblock Student" : "Block Student"}
                                >
                                  {student.blocked ? <Unlock size={16} /> : <Lock size={16} />}
                                  <span className="sr-only">{student.blocked ? "Unblock" : "Block"}</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      disabled={loading}
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete {student.name}'s profile and cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => handleDeleteStudent(student.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                            No students found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>


              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <Card
                        key={student.id}
                        className={`overflow-hidden ${student.blocked ? "border-red-300 bg-red-50" : ""}`}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-lg font-semibold">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{student.name}</h3>
                                  {student.blocked && (
                                    <Badge variant="destructive" className="ml-1">
                                      Blocked
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{student.department}</p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                student.placementStatus === "Placed"
                                  ? "default"
                                  : student.placementStatus === "Interviewing"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {student.placementStatus}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-sm">
                              <span className="font-medium">ID:</span> {student.id.substring(0, 8)}...
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Year:</span> {student.year}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">CGPA:</span> {student.cgpa}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Email:</span> {student.email}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectStudent(student)}
                              disabled={loading}
                            >
                              View Profile
                            </Button>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={student.blocked ? "text-green-500" : "text-amber-500"}
                                onClick={() => handleToggleBlockStudent(student)}
                                disabled={loading}
                              >
                                {student.blocked ? (
                                  <Unlock size={14} className="mr-1" />
                                ) : (
                                  <Lock size={14} className="mr-1" />
                                )}
                                {student.blocked ? "Unblock" : "Block"}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    disabled={loading}
                                  >
                                    <i className="fa-solid fa-trash mr-1"></i>
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete {student.name}'s profile and cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDeleteStudent(student.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <i className="fa-solid fa-user-slash text-4xl mb-2"></i>
                      <p>No students found matching your search criteria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Card>


      {/* Student Detail Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              </TabsList>


              <TabsContent value="overview">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-3xl font-semibold">
                          {selectedStudent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-1">{selectedStudent.name}</h3>
                      <p className="text-gray-500 mb-2">{selectedStudent.department}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge variant={selectedStudent.status === "Active" ? "default" : "secondary"}>
                          {selectedStudent.status}
                        </Badge>
                        {selectedStudent.blocked && <Badge variant="destructive">Blocked</Badge>}
                      </div>
                      <div className="w-full">
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                          <p className="text-sm text-gray-600">ID: {selectedStudent.id.substring(0, 8)}...</p>
                          <p className="text-sm text-gray-600">Year: {selectedStudent.year}</p>
                          <p className="text-sm text-gray-600">CGPA: {selectedStudent.cgpa}</p>
                          <p className="text-sm text-gray-600">Placement: {selectedStudent.placementStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <i className="fa-solid fa-envelope mr-2"></i>
                            {selectedStudent.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <i className="fa-solid fa-phone mr-2"></i>
                            {selectedStudent.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <i className="fa-solid fa-location-dot mr-2"></i>
                            {selectedStudent.address}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Academic Information</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <i className="fa-solid fa-calendar-day mr-2"></i>
                            Enrollment Date: {selectedStudent.enrollmentDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            <i className="fa-solid fa-graduation-cap mr-2"></i>
                            Expected Graduation: {selectedStudent.expectedGraduation}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Skills</h4>
                        <p className="text-sm text-gray-600">{selectedStudent.skills}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Bio</h4>
                        <p className="text-sm text-gray-600">{selectedStudent.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>


              <TabsContent value="edit">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="edit-name"
                        value={selectedStudent.name}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="edit-email"
                        value={selectedStudent.email}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            email: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-department" className="text-right">
                        Department
                      </Label>
                      <Select
                        value={selectedStudent.department}
                        onValueChange={(value) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            department: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-year" className="text-right">
                        Year
                      </Label>
                      <Select
                        value={selectedStudent.year}
                        onValueChange={(value) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            year: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-cgpa" className="text-right">
                        CGPA
                      </Label>
                      <Input
                        id="edit-cgpa"
                        value={selectedStudent.cgpa}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            cgpa: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="edit-phone"
                        value={selectedStudent.phone}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            phone: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-address" className="text-right">
                        Address
                      </Label>
                      <Textarea
                        id="edit-address"
                        value={selectedStudent.address}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            address: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-skills" className="text-right">
                        Skills
                      </Label>
                      <Textarea
                        id="edit-skills"
                        value={selectedStudent.skills}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            skills: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-bio" className="text-right">
                        Bio
                      </Label>
                      <Textarea
                        id="edit-bio"
                        value={selectedStudent.bio}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            bio: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={selectedStudent.status}
                        onValueChange={(value) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Graduated">Graduated</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-enrollment" className="text-right">
                        Enrollment Date
                      </Label>
                      <Input
                        id="edit-enrollment"
                        type="date"
                        value={selectedStudent.enrollmentDate}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            enrollmentDate: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-graduation" className="text-right">
                        Expected Graduation
                      </Label>
                      <Input
                        id="edit-graduation"
                        type="date"
                        value={selectedStudent.expectedGraduation}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            expectedGraduation: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-placement" className="text-right">
                        Placement Status
                      </Label>
                      <Select
                        value={selectedStudent.placementStatus}
                        onValueChange={(value) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            placementStatus: value,
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Placement Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="Searching">Searching</SelectItem>
                          <SelectItem value="Interviewing">Interviewing</SelectItem>
                          <SelectItem value="Placed">Placed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-blocked" className="text-right">
                        Block Status
                      </Label>
                      <Select
                        value={selectedStudent.blocked ? "blocked" : "active"}
                        onValueChange={(value) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            blocked: value === "blocked",
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Block Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateStudent(selectedStudent)} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}





