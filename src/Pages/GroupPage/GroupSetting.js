import React, { useState, useEffect } from "react";
import {
  Settings, Calendar, DollarSign, MapPin, Camera,
  Users, Bell, Lock, Trash2, X, AlertTriangle,
} from "lucide-react";

// Import Dialog components
import { Dialog } from "../../components/ui/dialog/Dialog";
import DialogContent from "../../components/ui/dialog/DialogContent";
import DialogHeader from "../../components/ui/dialog/DialogHeader";
import DialogTitle from "../../components/ui/dialog/DialogTitle";

// Import Input and Button
import { Input } from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";

// Import Tabs components
import Tabs from "../../components/ui/tabs/Tabs";
import TabsContent from "../../components/ui/tabs/TabsContent";
import TabsList from "../../components/ui/tabs/TabsList";
import TabsTrigger from "../../components/ui/tabs/TabsTrigger";

import { Textarea } from "../../components/custom/Textarea";
import { TabButton } from "../../components/custom/TabButton";
import { DeleteConfirmationDialog } from "../../components/custom/DeleteConfirmationDialog";

const GroupSetting = ({
  isOpen = false,
  onClose = () => {},
  groupData,
  onUpdateGroup = () => {},
  onDeleteGroup = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    date: "",
    destination: "",
    privacy: "public",
    notifications: "all",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (groupData) {
      setFormData({
        name: groupData.name || "",
        description: groupData.description || "",
        budget: groupData.budget || "",
        date: groupData.date || "",
        destination: groupData.destination || "",
        privacy: groupData.privacy || "public",
        notifications: groupData.notifications || "all",
      });
    }
  }, [groupData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear error for the field being changed
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Group name is required";
    if (formData.budget && isNaN(Number(formData.budget))) newErrors.budget = "Budget must be a valid number";
    if (formData.date && new Date(formData.date) < new Date()) newErrors.date = "Date cannot be in the past";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdateGroup(formData);
      setHasUnsavedChanges(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleDeleteConfirm = () => {
    if (onDeleteGroup) {
      onDeleteGroup();
    }
    setShowDeleteDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Group Settings</DialogTitle>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid grid-cols-3 gap-4 shrink-0">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto py-2">
              <TabsContent value="general" className="space-y-3 h-full">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Group Name
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter group name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <span className="text-red-500 text-sm mt-1 block">
                            {errors.name}
                          </span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          /* Add image upload handler */
                        }}
                        title="Upload group image"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Add group description"
                      className="resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) =>
                          handleInputChange("budget", e.target.value)
                        }
                        placeholder="Set budget"
                        className={`pl-10 ${
                          errors.budget ? "border-red-500" : ""
                        }`}
                      />
                      {errors.budget && (
                        <span className="text-red-500 text-sm mt-1 block">
                          {errors.budget}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className={`pl-10 ${
                          errors.date ? "border-red-500" : ""
                        }`}
                      />
                      {errors.date && (
                        <span className="text-red-500 text-sm mt-1 block">
                          {errors.date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        value={formData.destination}
                        onChange={(e) =>
                          handleInputChange("destination", e.target.value)
                        }
                        placeholder="Set destination"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="h-full">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-1 block">
                    Privacy Settings
                  </label>
                  <div className="space-y-2">
                    <TabButton
                      icon={Users}
                      title="Public Group"
                      description="Anyone can join this group"
                      value="public"
                      currentValue={formData.privacy}
                      onClick={(value) => handleInputChange("privacy", value)}
                    />
                    <TabButton
                      icon={Lock}
                      title="Private Group"
                      description="Only invited members can join"
                      value="private"
                      currentValue={formData.privacy}
                      onClick={(value) => handleInputChange("privacy", value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="h-full">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-1 block">
                    Notification Settings
                  </label>
                  <div className="space-y-2">
                    <TabButton
                      icon={Bell}
                      title="All Messages"
                      description="Get notified for all messages"
                      value="all"
                      currentValue={formData.notifications}
                      onClick={(value) =>
                        handleInputChange("notifications", value)
                      }
                    />
                    <TabButton
                      icon={Bell}
                      title="Mentions Only"
                      description="Only get notified when mentioned"
                      value="mentions"
                      currentValue={formData.notifications}
                      onClick={(value) =>
                        handleInputChange("notifications", value)
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex flex-col space-y-2 mt-4 shrink-0">
            <Button
              onClick={handleSave}
              className="w-full"
              disabled={Object.keys(errors).length > 0}
            >
              Save Changes
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default GroupSetting;