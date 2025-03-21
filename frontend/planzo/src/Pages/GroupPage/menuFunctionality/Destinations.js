import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
} from "lucide-react";

const Destinations = ({ tripData = {} }) => {
  // Default destinations if none provided
  const defaultDestinations = [
    {
      name: "Paris",
      country: "France",
      days: 3,
      attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
      notes: "Book Eiffel Tower tickets in advance",
    },
    {
      name: "Rome",
      country: "Italy",
      days: 4,
      attractions: ["Colosseum", "Vatican", "Trevi Fountain"],
      notes: "Vatican requires modest dress code",
    },
    {
      name: "Barcelona",
      country: "Spain",
      days: 3,
      attractions: ["Sagrada Familia", "Park Güell", "La Rambla"],
      notes: "Watch for pickpockets on La Rambla",
    },
  ];

  const [destinations, setDestinations] = useState(
    tripData.destinations || defaultDestinations
  );
  const [expandedDestination, setExpandedDestination] = useState(null);
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: "",
    country: "",
    days: 1,
    attractions: [],
    notes: "",
  });
  const [newAttraction, setNewAttraction] = useState("");

  const handleToggleExpand = (index) => {
    if (expandedDestination === index) {
      setExpandedDestination(null);
    } else {
      setExpandedDestination(index);
    }
  };

  const handleAddDestination = () => {
    if (newDestination.name.trim() === "") return;

    setDestinations([...destinations, newDestination]);
    setNewDestination({
      name: "",
      country: "",
      days: 1,
      attractions: [],
      notes: "",
    });
    setIsAddingDestination(false);
  };

  const handleAddAttraction = () => {
    if (newAttraction.trim() === "") return;
    setNewDestination({
      ...newDestination,
      attractions: [...newDestination.attractions, newAttraction],
    });
    setNewAttraction("");
  };

  const handleRemoveAttraction = (index) => {
    const updatedAttractions = [...newDestination.attractions];
    updatedAttractions.splice(index, 1);
    setNewDestination({
      ...newDestination,
      attractions: updatedAttractions,
    });
  };

  const handleDeleteDestination = (index) => {
    const updatedDestinations = [...destinations];
    updatedDestinations.splice(index, 1);
    setDestinations(updatedDestinations);
    if (expandedDestination === index) {
      setExpandedDestination(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          Selected Destinations
        </h3>
        <button
          onClick={() => setIsAddingDestination(true)}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          disabled={isAddingDestination}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {isAddingDestination ? (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in space-y-3">
          <h4 className="font-medium text-blue-800 mb-2">
            Add New Destination
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Name
              </label>
              <input
                type="text"
                value={newDestination.name}
                onChange={(e) =>
                  setNewDestination({ ...newDestination, name: e.target.value })
                }
                placeholder="e.g. London"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={newDestination.country}
                onChange={(e) =>
                  setNewDestination({
                    ...newDestination,
                    country: e.target.value,
                  })
                }
                placeholder="e.g. United Kingdom"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              value={newDestination.days}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  days: parseInt(e.target.value) || 1,
                })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attractions
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newAttraction}
                onChange={(e) => setNewAttraction(e.target.value)}
                placeholder="Add an attraction"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddAttraction}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {newDestination.attractions.length > 0 && (
              <div className="space-y-1 mb-2">
                {newDestination.attractions.map((attraction, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-white rounded-lg"
                  >
                    <span>{attraction}</span>
                    <button
                      onClick={() => handleRemoveAttraction(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newDestination.notes}
              onChange={(e) =>
                setNewDestination({ ...newDestination, notes: e.target.value })
              }
              placeholder="Any important notes about this destination"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-20"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsAddingDestination(false)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDestination}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              disabled={!newDestination.name}
            >
              Add Destination
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div
                className="p-4 bg-white cursor-pointer flex justify-between items-center"
                onClick={() => handleToggleExpand(index)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{destination.name}</h4>
                    <span className="ml-2 text-xs text-gray-500">
                      {destination.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{destination.days} days</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{destination.attractions.length} attractions</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDestination(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedDestination === index && (
                <div className="p-4 bg-blue-50 border-t">
                  <h5 className="font-medium text-sm mb-2">Attractions</h5>
                  <ul className="space-y-1 mb-4">
                    {destination.attractions.map((attraction, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{attraction}</span>
                      </li>
                    ))}
                  </ul>

                  {destination.notes && (
                    <div className="mt-2">
                      <h5 className="font-medium text-sm mb-1">Notes</h5>
                      <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">
                        {destination.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {destinations.length === 0 && !isAddingDestination && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-500">No destinations added yet.</p>
          <button
            onClick={() => setIsAddingDestination(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Destination
          </button>
        </div>
      )}
    </div>
  );
};

export default Destinations;
