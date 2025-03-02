import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  User,
  Plane,
  Calendar,
  Map,
  Wallet,
  Users,
  Send,
} from "lucide-react";
import { useTripService } from "../../services/tripService";
import { useAuth0 } from "@auth0/auth0-react";

const CreateTripModal = ({ isOpen, onClose, onCreateTrip, initialData }) => {
  const { isAuthenticated } = useAuth0();
  const { createTrip } = useTripService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Use a ref to track if the form has been submitted
  const formSubmitted = useRef(false);

  const [tripData, setTripData] = useState({
    name: "",
    mainDestination: "",
    startDate: "",
    endDate: "",
    description: "",
    budget: initialData?.budget || "",
    members: [],
  });

  const [newMember, setNewMember] = useState({
    name: "",
    role: "Member",
  });

  // Reset form state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      // Reset form state when modal opens
      setError(null);
      setIsSubmitting(false);
      formSubmitted.current = false;

      // Apply initial data if provided
      if (initialData) {
        setTripData((prev) => ({
          ...prev,
          mainDestination: initialData.mainDestination || prev.mainDestination,
          budget: initialData.budget || prev.budget,
          name:
            initialData.name ||
            (initialData.mainDestination
              ? `Trip to ${initialData.mainDestination}`
              : prev.name),
        }));
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = () => {
    if (newMember.name.trim()) {
      setTripData((prev) => ({
        ...prev,
        members: [...prev.members, { ...newMember, id: Date.now() }],
      }));
      setNewMember({ name: "", role: "Member" });
    }
  };

  const handleRemoveMember = (memberId) => {
    setTripData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== memberId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Prevent duplicate submissions
    if (formSubmitted.current || isSubmitting) {
      console.log("Form already submitted, preventing duplicate submission");
      return;
    }

    // Mark as submitted immediately
    formSubmitted.current = true;
    setIsSubmitting(true);

    if (!isAuthenticated) {
      setError("You must be logged in to create a trip");
      setIsSubmitting(false);
      formSubmitted.current = false;
      return;
    }

    try {
      setError(null);

      // Generate a unique request ID for idempotency
      const requestId = `req_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Prepare data for API - clean up member IDs which are just for UI
      const apiTripData = {
        ...tripData,
        members: tripData.members.map(({ name, role }) => ({ name, role })),
        requestId, // Add the request ID for idempotency
      };

      // Call backend API
      const createdTrip = await createTrip(apiTripData);
      console.log("Trip created successfully:", createdTrip);

      // Call parent component callback with the created trip
      if (onCreateTrip && typeof onCreateTrip === "function") {
        onCreateTrip(apiTripData);
      }

      // Reset form
      setTripData({
        name: "",
        mainDestination: "",
        startDate: "",
        endDate: "",
        description: "",
        budget: "",
        members: [],
      });

      // Close the modal
      onClose();
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.message || "Failed to create trip. Please try again.");
      formSubmitted.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
        <div className="absolute right-6 top-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Plane className="w-8 h-8 text-pink-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800">
            Let's Plan Your Adventure! ✨
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Map className="w-4 h-4 text-blue-400" />
                What shall we call this adventure?
              </label>
              <input
                type="text"
                name="name"
                value={tripData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border-2 border-blue-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 hover:border-blue-200"
                placeholder="e.g., Summer Beach Escape 🏖️"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Plane className="w-4 h-4 text-green-400" />
                Where are we heading?
              </label>
              <input
                type="text"
                name="mainDestination"
                value={tripData.mainDestination}
                onChange={handleInputChange}
                className="w-full rounded-xl border-2 border-green-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 hover:border-green-200"
                placeholder="e.g., Bali, Indonesia 🌴"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={tripData.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 border-purple-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-200"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={tripData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 border-purple-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Send className="w-4 h-4 text-orange-400" />
                Tell us about the trip!
              </label>
              <textarea
                name="description"
                value={tripData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-xl border-2 border-orange-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                placeholder="What makes this trip special? 🌟"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                What's the budget?
              </label>
              <input
                type="number"
                name="budget"
                value={tripData.budget}
                onChange={handleInputChange}
                className="w-full rounded-xl border-2 border-emerald-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200 hover:border-emerald-200"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 text-pink-400" />
                Who's joining the adventure?
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Add friend's name ✨"
                  className="flex-1 rounded-xl border-2 border-pink-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 hover:border-pink-200"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {tripData.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-pink-50 p-3 rounded-xl transition-all duration-200 hover:bg-pink-100"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      <span className="text-gray-700">{member.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-pink-400 hover:text-pink-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Maybe Later
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Plane className="w-5 h-5" />
                  Start Adventure!
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
