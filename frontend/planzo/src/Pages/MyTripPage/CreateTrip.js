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
  ChevronRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useTripService } from "../../services/tripService";
import { useAuth0 } from "@auth0/auth0-react";

const CreateTripModal = ({ isOpen, onClose, onCreateTrip, initialData }) => {
  const { isAuthenticated } = useAuth0();
  const { createTrip } = useTripService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);
  const modalRef = useRef(null);

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
      // Animate modal in
      setTimeout(() => setAnimateIn(true), 50);

      // Reset form state when modal opens
      setError(null);
      setIsSubmitting(false);
      formSubmitted.current = false;
      setActiveStep(1);

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
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, initialData]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

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

  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const goToPrevStep = () => {
    setActiveStep((prev) => prev - 1);
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

      // Show success for a moment before closing
      setActiveStep(3);
      setTimeout(() => {
        // Close the modal
        onClose();
      }, 2000);
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div
        ref={modalRef}
        className={`bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 ease-out ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-blue-500 to-pink-500 h-1">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{
              width: `${activeStep === 3 ? 100 : activeStep === 2 ? 66 : 33}%`,
              opacity: 0.2,
            }}
          />
        </div>

        <div className="p-8 relative">
          {/* Close button */}
          <div className="absolute right-6 top-6 z-10">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-pink-500 p-3 text-white shadow-lg">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {activeStep === 3
                  ? "Trip Created Successfully!"
                  : "Plan Your Adventure"}
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {activeStep === 1
                  ? "Let's get the basic details right"
                  : activeStep === 2
                  ? "Add some personality to your trip"
                  : "Your adventure awaits!"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fadeIn">
              <div className="min-w-6">❌</div>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-slideIn">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Map className="w-4 h-4 text-blue-500" />
                    Trip Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={tripData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 hover:border-blue-200"
                    placeholder="e.g., Summer Beach Escape 🏖️"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Plane className="w-4 h-4 text-green-500" />
                    Destination
                  </label>
                  <input
                    type="text"
                    name="mainDestination"
                    value={tripData.mainDestination}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-green-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 hover:border-green-200"
                    placeholder="e.g., Bali, Indonesia 🌴"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={tripData.startDate}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={tripData.endDate}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-slideIn">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Send className="w-4 h-4 text-orange-500" />
                    Trip Description
                  </label>
                  <textarea
                    name="description"
                    value={tripData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full rounded-xl border-2 border-orange-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                    placeholder="Share your excitement! What makes this trip special? What are you looking forward to? 🌟"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Wallet className="w-4 h-4 text-emerald-500" />
                    Budget (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="budget"
                      value={tripData.budget}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-emerald-100 pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200 hover:border-emerald-200"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Set your ideal budget for this adventure
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 text-pink-500" />
                      Trip Members
                    </label>
                    <span className="text-xs text-gray-500">
                      You can add more members later
                    </span>
                  </div>

                  <div className="space-y-3 mt-3">
                    {tripData.members.length > 0 ? (
                      tripData.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-pink-50 p-3 rounded-xl transition-all duration-200 hover:bg-pink-100 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-pink-200 rounded-full p-2 group-hover:bg-pink-300 transition-colors duration-200">
                              <User className="w-4 h-4 text-pink-600" />
                            </div>
                            <span className="text-gray-700 font-medium">
                              {member.name}
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded-full text-pink-500 border border-pink-100">
                              {member.role}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-pink-400 hover:text-pink-600 transition-colors duration-200 bg-white rounded-full p-1 hover:bg-pink-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-xl text-gray-500 border-2 border-dashed border-gray-200">
                        You can add travel companions after creating the trip
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success Screen */}
            {activeStep === 3 && (
              <div className="flex flex-col items-center justify-center py-8 animate-scaleIn">
                <div className="mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Trip Created Successfully!
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Get ready for an amazing adventure to{" "}
                  {tripData.mainDestination}!
                </p>
                <div className="w-full max-w-sm p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <p className="text-sm text-blue-600">
                    You can invite friends, add activities, and make changes
                    anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              {activeStep === 1 && (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
                    disabled={
                      !tripData.name ||
                      !tripData.mainDestination ||
                      !tripData.startDate ||
                      !tripData.endDate
                    }
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={
                      isSubmitting || !tripData.description || !tripData.budget
                    }
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Trip...
                      </span>
                    ) : (
                      <>
                        <Plane className="w-5 h-5" />
                        Create Trip
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default CreateTripModal;
