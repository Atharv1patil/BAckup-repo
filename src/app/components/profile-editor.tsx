"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type UserData = {
  auth: {
    email: string;
    role: string;
  };
};

const studentImage = "https://public.readdy.ai/ai/img_res/84e10cf703b2fe4ca541bc42e95edcfa.jpg";
const API_URL = "http://localhost:5000/profile"; // Flask API URL

const ProfileEditor: React.FC = () => {
  const [email, setEmail] = useState(""); // Temporary email state for fetching data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    major: "",
    graduationYear: "",
    cgpa: "",
    skills: [] as string[], // Ensure skills is always an array
    bio: "",
    publicProfile: true,
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      const parsedData: UserData = JSON.parse(data);
      setUserData(parsedData);
      setEmail(parsedData.auth.email); // Set email here
    }
  }, []);

  const [newSkill, setNewSkill] = useState("");
//   const userData: UserData = JSON.parse(localStorage.getItem('userData')!);

//   console.log(userData.auth.email);
// console.log(userData.auth.role);
// setEmail(userData.auth.email);

  // Fetch profile data from backend when email is entered
  const fetchProfile = () => {
    if (!email.trim()) return alert("Please enter an email to fetch the profile.");
    
    fetch(`${API_URL}/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then((data) => {
        setProfileData({ ...data, skills: data.skills || [] });
      })
      .catch((err) => alert(err.message));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProfileData((prev) => ({ ...prev, publicProfile: checked }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!profileData.email) {
      alert("Email is required!");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })
      .then((res) => res.json())
      .then(() => alert("Profile saved successfully!"))
      .catch((err) => console.error("Error saving profile:", err));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-8">
        <div className="mb-6">
          {/* <Label htmlFor="emailFetch">Enter Email to Fetch Profile</Label> */}
          <div className="flex gap-2">
            {/* <Input id="emailFetch" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
            <Button onClick={fetchProfile}>Fetch</Button>
          </div>
        </div>

        <div className="flex items-center gap-8 mb-8">
          <Avatar className="w-32 h-32">
            <img src={studentImage || "/placeholder.svg"} alt="Profile" className="object-cover" />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
            <Button className="!rounded-button">
              <i className="fa-solid fa-camera mr-2"></i>
              Change Photo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Input id="major" name="major" value={profileData.major} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input id="graduationYear" name="graduationYear" value={profileData.graduationYear} onChange={handleInputChange} />
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="cgpa">CGPA</Label>
              <Input id="cgpa" name="cgpa" value={profileData.cgpa} onChange={handleInputChange} />
            </div>

            {/* Skills Section */}
            <div>
              <Label htmlFor="skills">Skills</Label>
              <div className="flex space-x-2">
                <Input id="skills" name="skills" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                <Button onClick={handleAddSkill}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-200 px-3 py-1 rounded-lg flex items-center">
                    {skill}
                    <button onClick={() => handleRemoveSkill(index)} className="ml-2 text-red-500 hover:text-red-700">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows={4} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="public-profile" checked={profileData.publicProfile} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="public-profile">Make profile public</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" className="!rounded-button">Cancel</Button>
              <Button className="!rounded-button" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileEditor;
