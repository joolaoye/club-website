"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Calendar
} from "lucide-react";
import { formatDate } from "@workspace/ui/lib/utils";

// Mock data - replace with actual API calls
const mockOfficers = [
  {
    id: 1,
    name: "John Smith",
    title: "President",
    email: "john@university.edu",
    bio: "John is a senior Computer Science major with a passion for full-stack development and machine learning. He has led multiple successful hackathons and internships at tech companies.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-08-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Vice President",
    email: "sarah@university.edu",
    bio: "Sarah is passionate about cybersecurity and AI. She organizes our technical workshops and maintains our club's infrastructure. When not coding, she enjoys rock climbing.",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-08-01",
    isActive: true,
  },
  {
    id: 3,
    name: "Mike Davis",
    title: "Secretary",
    email: "mike@university.edu",
    bio: "Mike handles all our communication and documentation. He's studying Software Engineering and is particularly interested in DevOps and cloud computing.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-09-15",
    isActive: true,
  },
  {
    id: 4,
    name: "Emily Chen",
    title: "Event Coordinator",
    email: "emily@university.edu",
    bio: "Emily plans and executes all our events, from small study groups to large hackathons. She's majoring in Computer Science with a minor in Business Administration.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-01-10",
    isActive: false,
  },
];

interface Officer {
  id: number;
  name: string;
  title: string;
  email: string;
  bio: string;
  photoUrl: string;
  joinedAt: string;
  isActive: boolean;
}

export default function OfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>(mockOfficers);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    bio: "",
    photoUrl: "",
  });

  const activeOfficers = officers.filter(o => o.isActive);
  const inactiveOfficers = officers.filter(o => !o.isActive);

  const handleCreateOfficer = () => {
    if (!formData.name || !formData.title || !formData.email) return;

    const officer: Officer = {
      id: Date.now(),
      name: formData.name,
      title: formData.title,
      email: formData.email,
      bio: formData.bio,
      photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      joinedAt: new Date().toISOString(),
      isActive: true,
    };

    setOfficers([...officers, officer]);
    setFormData({ name: "", title: "", email: "", bio: "", photoUrl: "" });
    setShowCreateDialog(false);
  };

  const handleEditOfficer = () => {
    if (!selectedOfficer || !formData.name || !formData.title || !formData.email) return;

    const updatedOfficers = officers.map(o => 
      o.id === selectedOfficer.id 
        ? { ...o, ...formData }
        : o
    );

    setOfficers(updatedOfficers);
    setSelectedOfficer(null);
    setFormData({ name: "", title: "", email: "", bio: "", photoUrl: "" });
    setShowEditDialog(false);
  };

  const handleDeleteOfficer = (id: number) => {
    setOfficers(officers.filter(o => o.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setOfficers(officers.map(o => 
      o.id === id ? { ...o, isActive: !o.isActive } : o
    ));
  };

  const openEditDialog = (officer: Officer) => {
    setSelectedOfficer(officer);
    setFormData({
      name: officer.name,
      title: officer.title,
      email: officer.email,
      bio: officer.bio,
      photoUrl: officer.photoUrl,
    });
    setShowEditDialog(true);
  };

  const OfficerCard = ({ officer }: { officer: Officer }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <img 
            src={officer.photoUrl} 
            alt={officer.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{officer.name}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{officer.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  {officer.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Joined {formatDate(officer.joinedAt)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(officer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteOfficer(officer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{officer.bio}</p>
        <div className="flex items-center justify-between mt-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            officer.isActive 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {officer.isActive ? "Active" : "Inactive"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(officer.id)}
          >
            {officer.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const OfficerForm = ({ onSubmit, submitLabel }: { onSubmit: () => void, submitLabel: string }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="Enter full name..."
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., President, Vice President..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input 
          type="email"
          className="w-full px-3 py-2 border rounded-md" 
          placeholder="Enter email address..."
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Photo URL</label>
        <input 
          className="w-full px-3 py-2 border rounded-md" 
          placeholder="Enter photo URL (optional)..."
          value={formData.photoUrl}
          onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-md" 
          rows={4}
          placeholder="Write a bio for the public officer profile..."
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={() => {
            setShowCreateDialog(false);
            setShowEditDialog(false);
            setFormData({ name: "", title: "", email: "", bio: "", photoUrl: "" });
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Officers</h1>
          <p className="text-muted-foreground">Manage officer profiles for the public website</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Officer
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Officers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeOfficers.map((officer) => (
              <OfficerCard key={officer.id} officer={officer} />
            ))}
            {activeOfficers.length === 0 && (
              <p className="text-center text-muted-foreground py-8 col-span-2">
                No active officers yet.
              </p>
            )}
          </div>
        </div>

        {inactiveOfficers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Inactive Officers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {inactiveOfficers.map((officer) => (
                <OfficerCard key={officer.id} officer={officer} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Officer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Officer</DialogTitle>
          </DialogHeader>
          <OfficerForm onSubmit={handleCreateOfficer} submitLabel="Add Officer" />
        </DialogContent>
      </Dialog>

      {/* Edit Officer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Officer Profile</DialogTitle>
          </DialogHeader>
          <OfficerForm onSubmit={handleEditOfficer} submitLabel="Update Officer" />
        </DialogContent>
      </Dialog>
    </div>
  );
} 