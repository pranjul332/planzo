import React, { useState } from "react";
import { X } from "lucide-react";

const AddMemberModal = ({ isOpen, onClose, onAdd }) => {
  const [newMember, setNewMember] = useState({ name: "", role: "Member" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      ...newMember,
    });
    setNewMember({ name: "", role: "Member" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Member</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="Member">Member</option>
              <option value="Organizer">Organizer</option>
              <option value="Guide">Guide</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition-colors"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
