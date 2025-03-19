export interface NotificationType {
  id: number
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

export interface MetricType {
  title: string
  value: string
  growth: string
  icon: string
}

export interface StudentType {
  id: number
  name: string
  department: string
  year: string
  cgpa: string
  status: string
}

export interface JobType {
  id: number
  company: string
  logo: string
  position: string
  location: string
  type: string
  salary: string
  posted: string
  deadline: string
  requirements: string[]
  description: string
}

export interface ProfileDataType {
  name: string
  email: string
  department: string
  year: string
  cgpa: string
  phone: string
  address: string
  skills: string
  bio: string
}

