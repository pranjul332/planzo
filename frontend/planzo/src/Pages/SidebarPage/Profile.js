import React, { useState } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "John Doe",
    email: "john.doe@example.com",
    gender: "",
    address: "",
  });

  const handleProfileUpdate = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="/api/placeholder/128/128"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  handleProfileUpdate("username", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileUpdate("email", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => handleProfileUpdate("gender", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) => handleProfileUpdate("address", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                rows={3}
              />
            </div>

            <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
