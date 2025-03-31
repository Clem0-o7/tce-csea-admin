import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, FileText, Pencil, Trash2 } from 'lucide-react';

export default function MagazineAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [magazines, setMagazines] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    description: '',
    pdfUrl: '',
    thumbnailUrl: '',
    in_carousal: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check session status and handle redirection or fetching data
  useEffect(() => {
    // Wait until session status is determined
    if (status === 'loading') return;

    // If not authenticated, redirect to the login page
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    // If authenticated, fetch magazines
    if (status === 'authenticated') {
      fetchMagazines();
    }
  }, [status, router]);

  // Function to fetch magazines
  const fetchMagazines = async () => {
    try {
      const response = await fetch('/api/admin/magazines');
      if (!response.ok) {
        throw new Error('Failed to fetch magazines');
      }
      const data = await response.json();
      setMagazines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching magazines:', err);
      setError('Failed to fetch magazines');
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const magazineData = {
      ...formData,
      thumbnailUrl: convertGDriveLink(formData.thumbnailUrl),
      pdfUrl: convertGDriveLink(formData.pdfUrl)
    };

    try {
      const url = isEditMode 
        ? `/api/admin/magazines/${currentMagazine.id}` 
        : '/api/admin/magazines';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(magazineData)
      });

      if (!response.ok) throw new Error('Failed to save magazine');

      setSuccess(isEditMode ? 'Magazine updated successfully' : 'Magazine created successfully');
      fetchMagazines();
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (magazine) => {
    setIsEditMode(true);
    setCurrentMagazine(magazine);
    setFormData({
      name: magazine.name,
      year: magazine.year,
      description: magazine.description || '',
      pdfUrl: magazine.pdfUrl,
      thumbnailUrl: magazine.thumbnailUrl,
      in_carousal: magazine.in_carousal
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this magazine?')) return;

    try {
      const response = await fetch(`/api/admin/magazines/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete magazine');

      setSuccess('Magazine deleted successfully');
      fetchMagazines();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear().toString(),
      description: '',
      pdfUrl: '',
      thumbnailUrl: '',
      in_carousal: false
    });
    setIsEditMode(false);
    setCurrentMagazine(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Magazines</h1>
          {isEditMode && (
            <Button variant="outline" onClick={resetForm}>
              Add New Magazine
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
            <CardTitle>{isEditMode ? 'Edit Magazine' : 'Add New Magazine'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Magazine Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfUrl">PDF URL (Google Drive)</Label>
                  <Input
                    id="pdfUrl"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Thumbnail URL (Google Drive)</Label>
                  <Input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="in_carousal"
                    checked={formData.in_carousal}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, in_carousal: checked }))
                    }
                  />
                  <Label htmlFor="in_carousal">Show in Carousel</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                {isEditMode && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditMode ? 'Update Magazine' : 'Create Magazine'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Magazines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {magazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{magazine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Year: {magazine.year}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {magazine.thumbnailUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(magazine.thumbnailUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {magazine.pdfUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(magazine.pdfUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(magazine)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(magazine.id)}
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