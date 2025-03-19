// import type React from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Avatar } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import type { JobType } from "../../../../types1"

// export const Jobs: React.FC = () => {
//   const jobs: JobType[] = [
//     {
//       id: 1,
//       company: "Microsoft",
//       logo: "https://public.readdy.ai/ai/img_res/c40c10ed287ccd0025c04efb1173b7d1.jpg",
//       position: "Software Development Engineer",
//       location: "Redmond, WA",
//       type: "Full Time",
//       salary: "$120,000 - $180,000",
//       posted: "2 days ago",
//       deadline: "2025-04-15",
//       requirements: ["5+ years of experience", "BS/MS in Computer Science", "Strong problem-solving skills"],
//       description: "Join our dynamic team to build next-generation cloud solutions...",
//     },
//     {
//       id: 2,
//       company: "Apple",
//       logo: "https://public.readdy.ai/ai/img_res/bd37ee506b0fce2c1e3b701c457e6a27.jpg",
//       position: "iOS Developer",
//       location: "Cupertino, CA",
//       type: "Full Time",
//       salary: "$130,000 - $190,000",
//       posted: "1 week ago",
//       deadline: "2025-04-20",
//       requirements: ["3+ years iOS development", "Swift expertise", "UI/UX knowledge"],
//       description: "Create amazing experiences for Apple users worldwide...",
//     },
//     {
//       id: 3,
//       company: "Google",
//       logo: "https://public.readdy.ai/ai/img_res/2655e00abd1d3b8ee8ae299bad408b0e.jpg",
//       position: "Machine Learning Engineer",
//       location: "Mountain View, CA",
//       type: "Full Time",
//       salary: "$140,000 - $200,000",
//       posted: "3 days ago",
//       deadline: "2025-04-25",
//       requirements: ["PhD in ML/AI preferred", "TensorFlow expertise", "Research experience"],
//       description: "Work on cutting-edge AI/ML projects...",
//     },
//   ]

//   return (
//     <div className="p-6">
//       <Card className="max-w-6xl mx-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold">Available Jobs</h2>
//             <div className="flex gap-4">
//               <Input type="search" placeholder="Search jobs..." className="w-[300px]" />
//               <Select defaultValue="all">
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter by Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="fulltime">Full Time</SelectItem>
//                   <SelectItem value="intern">Internship</SelectItem>
//                   <SelectItem value="contract">Contract</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <Tabs defaultValue="active" className="w-full">
//             <TabsList className="mb-4">
//               <TabsTrigger value="active">Active Jobs</TabsTrigger>
//               <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
//               <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
//             </TabsList>

//             <TabsContent value="active">
//               <ScrollArea className="h-[600px] pr-4">
//                 <div className="space-y-4">
//                   {jobs.map((job) => (
//                     <JobCard key={job.id} job={job} />
//                   ))}
//                 </div>
//               </ScrollArea>
//             </TabsContent>

//             <TabsContent value="applied">
//               <div className="text-center py-8 text-gray-500">
//                 <i className="fa-solid fa-paper-plane text-4xl mb-2"></i>
//                 <p>No jobs applied yet</p>
//               </div>
//             </TabsContent>

//             <TabsContent value="saved">
//               <div className="text-center py-8 text-gray-500">
//                 <i className="fa-regular fa-bookmark text-4xl mb-2"></i>
//                 <p>No saved jobs</p>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </Card>
//     </div>
//   )
// }

// interface JobCardProps {
//   job: JobType
// }

// const JobCard: React.FC<JobCardProps> = ({ job }) => {
//   return (
//     <Card key={job.id} className="p-6">
//       <div className="flex items-start gap-6">
//         <Avatar className="h-16 w-16">
//           <img src={job.logo || "/placeholder.svg"} alt={job.company} className="object-cover" />
//         </Avatar>
//         <div className="flex-1">
//           <div className="flex items-start justify-between">
//             <div>
//               <h3 className="text-xl font-semibold">{job.position}</h3>
//               <p className="text-gray-600">{job.company}</p>
//             </div>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button className="!rounded-button">View Details</Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl">
//                 <DialogHeader>
//                   <DialogTitle>Job Details</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="flex items-start gap-4">
//                     <Avatar className="h-16 w-16">
//                       <img src={job.logo || "/placeholder.svg"} alt={job.company} className="object-cover" />
//                     </Avatar>
//                     <div>
//                       <h3 className="text-xl font-semibold">{job.position}</h3>
//                       <p className="text-gray-600">{job.company}</p>
//                     </div>
//                   </div>
//                   <div className="grid gap-2">
//                     <p className="text-sm text-gray-600">
//                       <i className="fa-solid fa-location-dot mr-2"></i>
//                       {job.location}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <i className="fa-solid fa-clock mr-2"></i>
//                       {job.type}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <i className="fa-solid fa-dollar-sign mr-2"></i>
//                       {job.salary}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <i className="fa-solid fa-calendar-days mr-2"></i>
//                       Apply by {job.deadline}
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-2">Requirements</h4>
//                     <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                       {job.requirements.map((req, idx) => (
//                         <li key={idx}>{req}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-2">Description</h4>
//                     <p className="text-sm text-gray-600">{job.description}</p>
//                   </div>
//                   <div className="flex justify-end gap-4 mt-4">
//                     <Button variant="outline" className="!rounded-button">
//                       <i className="fa-regular fa-bookmark mr-2"></i>
//                       Save
//                     </Button>
//                     <Button className="!rounded-button">
//                       <i className="fa-solid fa-paper-plane mr-2"></i>
//                       Apply Now
//                     </Button>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <i className="fa-solid fa-location-dot"></i>
//               {job.location}
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <i className="fa-solid fa-clock"></i>
//               {job.type}
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <i className="fa-solid fa-dollar-sign"></i>
//               {job.salary}
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <i className="fa-solid fa-calendar-days"></i>
//               Posted {job.posted}
//             </div>
//           </div>
//           <div className="flex gap-4 mt-4">
//             <Badge variant="secondary">{job.type}</Badge>
//             <Badge variant="outline">Apply by {job.deadline}</Badge>
//           </div>
//         </div>
//       </div>
//     </Card>
//   )
// }

import PlacementOverview from '@/app/components/placement-overview'
import React from 'react'

function jobs1() {
  return (
    <PlacementOverview />
  )
}

export default jobs1