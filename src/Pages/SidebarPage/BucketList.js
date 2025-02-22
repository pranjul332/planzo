import React, { useState } from "react";
import { PlusCircle, Calendar, MapPin, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const BucketList = () => {
  const [bucketList, setBucketList] = useState([
    {
      id: 1,
      destination: "Santorini, Greece",
      plannedDate: "2024-07-15",
      notes: "Watch sunset at Oia, visit black sand beaches",
    },
    {
      id: 2,
      destination: "Kyoto, Japan",
      plannedDate: "2024-09-20",
      notes: "Visit during autumn for fall colors, temple visits",
    },
  ]);

  const [newItem, setNewItem] = useState({
    destination: "",
    plannedDate: "",
    notes: "",
  });

  const addToBucketList = () => {
    if (newItem.destination && newItem.plannedDate) {
      setBucketList([
        ...bucketList,
        {
          id: Date.now(),
          ...newItem,
        },
      ]);
      setNewItem({
        destination: "",
        plannedDate: "",
        notes: "",
      });
    }
  };

  const removeFromBucketList = (id) => {
    setBucketList(bucketList.filter((item) => item.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Travel Bucket List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Destination"
              className="rounded-md border p-2"
              value={newItem.destination}
              onChange={(e) =>
                setNewItem({ ...newItem, destination: e.target.value })
              }
            />
            <input
              type="date"
              className="rounded-md border p-2"
              value={newItem.plannedDate}
              onChange={(e) =>
                setNewItem({ ...newItem, plannedDate: e.target.value })
              }
            />
            <button
              onClick={addToBucketList}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <PlusCircle className="w-5 h-5" />
              Add to Bucket List
            </button>
          </div>

          <div className="space-y-4">
            {bucketList.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium">{item.destination}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Planned for:{" "}
                        {new Date(item.plannedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromBucketList(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketList;
