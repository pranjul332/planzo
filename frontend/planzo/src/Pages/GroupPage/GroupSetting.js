import React, { useState, useEffect } from "react";
import {
  Settings,
  Calendar,
  DollarSign,
  MapPin,
  Camera,
  Users,
  Bell,
  Lock,
  Trash2,
  X,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

import { Dialog } from "../../components/ui/dialog/Dialog";
import DialogContent from "../../components/ui/dialog/DialogContent";
import DialogHeader from "../../components/ui/dialog/DialogHeader";
import DialogTitle from "../../components/ui/dialog/DialogTitle";
import { Input } from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
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
    if (formData.budget && isNaN(Number(formData.budget)))
      newErrors.budget = "Budget must be a valid number";
    if (formData.date && new Date(formData.date) < new Date())
      newErrors.date = "Date cannot be in the past";
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
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
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

          <div className="mt-4">
            <Tabs
              defaultValue="general"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <div className="mt-4 h-[320px] overflow-y-auto pr-2">
                {activeTab === "general" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Group Name</label>
                      <div className="flex items-center space-x-2 mt-1">
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
                            <span className="text-red-500 text-sm mt-1">
                              {errors.name}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {}}
                          title="Upload group image"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Add group description"
                        className="resize-none mt-1"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Budget</label>
                      <div className="relative mt-1">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
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
                          <span className="text-red-500 text-sm mt-1">
                            {errors.budget}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <div className="relative mt-1">
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
                          <span className="text-red-500 text-sm mt-1">
                            {errors.date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Destination</label>
                      <div className="relative mt-1">
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
                )}

                {activeTab === "privacy" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Privacy Settings
                    </label>
                    <div className="space-y-2 mt-1">
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
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Notification Settings
                    </label>
                    <div className="space-y-2 mt-1">
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
                )}
              </div>
            </Tabs>
          </div>

          <div className="mt-6 space-y-2">
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
        onConfirm={() => {
          onDeleteGroup();
          setShowDeleteDialog(false);
          onClose();
        }}
      />
    </>
  );
};

export default GroupSetting;