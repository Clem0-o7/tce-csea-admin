import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';


export default function OfficeBearersAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [officeBearers, setOfficeBearers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBearer, setCurrentBearer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: 'CSE',
    batch: '',
    email: '',
    contactNumber: '',
    profileImage: '',
    socialLinks: {
      linkedin: '',
      github: '',
      instagram: ''
    },
    position: '',
    startYear: '',
    endYear: '',
    isCurrent: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Authentication check: wait for status, then fetch office bearers if authenticated
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to be determined

    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      fetchOfficeBearers();
    }
  }, [status, router]);

  const fetchOfficeBearers = async () => {
    try {
      const response = await fetch('/api/admin/office-bearers');
      if (!response.ok) {
        throw new Error('Failed to fetch office bearers');
      }
      const data = await response.json();
      
      // Format the dates for display
      const formattedData = data.map(bearer => ({
        ...bearer,
        startYear: bearer.startYear ? new Date(bearer.startYear).getFullYear().toString() : '',
        endYear: bearer.endYear ? new Date(bearer.endYear).getFullYear().toString() : ''
      }));
      
      setOfficeBearers(formattedData);
    } catch (error) {
      console.error('Error fetching office bearers:', error);
      setError('Failed to fetch office bearers');
    }
  };

  const convertGDriveLink = (url) => {
    if (!url || !url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/[-\w]{25,}/);
    if (!fileId) return url;
    
    return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const bearerData = {
        ...formData,
        profileImage: convertGDriveLink(formData.profileImage),
        startYear: formData.startYear ? new Date(formData.startYear, 0).toISOString() : null,
        endYear: formData.endYear ? new Date(formData.endYear, 0).toISOString() : null
      };
  
      const url = isEditMode 
        ? `/api/admin/office-bearers/${currentBearer.id}` 
        : '/api/admin/office-bearers';
      const method = isEditMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bearerData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save office bearer');
      }
  
      setSuccess(isEditMode ? 'Office bearer updated successfully' : 'Office bearer created successfully');
      fetchOfficeBearers();
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (bearer) => {
    setIsEditMode(true);
    setCurrentBearer(bearer);
    setFormData({
      ...bearer,
      socialLinks: bearer.socialLinks || {
        linkedin: '',
        github: '',
        instagram: ''
      },
      startYear: bearer.startYear ? new Date(bearer.startYear).getFullYear().toString() : '',
      endYear: bearer.endYear ? new Date(bearer.endYear).getFullYear().toString() : ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this office bearer?')) return;
  
    try {
      const response = await fetch(`/api/admin/office-bearers/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete office bearer');
      }
  
      setSuccess('Office bearer deleted successfully');
      fetchOfficeBearers();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      registerNumber: '',
      department: '',
      batch: '',
      email: '',
      contactNumber: '',
      profileImage: '',
      socialLinks: {
        linkedin: '',
        github: '',
        instagram: ''
      },
      position: '',
      startYear: '',
      endYear: '',
      isCurrent: false
    });
    setIsEditMode(false);
    setCurrentBearer(null);
  };

  if (status === 'loading') {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (status === 'unauthenticated') {
    return <AdminLayout>Access denied. Please sign in.</AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Office Bearers</h1>
          {isEditMode && (
            <Button variant="outline" onClick={resetForm}>
              Add New Office Bearer
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Office Bearer' : 'Add New Office Bearer'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerNumber">Register Number</Label>
                  <Input
                    id="registerNumber"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch</Label>
                  <Input
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    name="startYear"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    required
                    placeholder="YYYY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    name="endYear"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social.linkedin">LinkedIn URL</Label>
                  <Input
                    id="social.linkedin"
                    name="social.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social.github">GitHub URL</Label>
                  <Input
                    id="social.github"
                    name="social.github"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social.instagram">Instagram URL</Label>
                  <Input
                    id="social.instagram"
                    name="social.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isCurrent: checked }))
                    }
                  />
                  <Label htmlFor="isCurrent">Current Office Bearer</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {isEditMode && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditMode ? 'Update Office Bearer' : 'Create Office Bearer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Office Bearers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {officeBearers.map((bearer) => (
                <div
                  key={bearer.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{bearer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {bearer.position} ({bearer.startYear} - {bearer.endYear || 'Present'})
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {bearer.profileImage && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(bearer.profileImage, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(bearer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(bearer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}