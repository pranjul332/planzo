import React, { useState } from "react";
import { UserPlus, UserMinus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const Friends = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: "Sarah Wilson", email: "sarah@example.com" },
    { id: 2, name: "Mike Johnson", email: "mike@example.com" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const removeFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              <UserPlus className="w-5 h-5" />
              Add Friend
            </button>
          </div>

          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src="/api/placeholder/48/48"
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Friends;
