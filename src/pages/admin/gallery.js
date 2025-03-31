import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {useRouter} from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Camera, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
export default function GalleryAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    description: '',
    academicYear: new Date().getFullYear().toString(),
    tags: [],
    in_carousal: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Authentication check: redirect to login if not authenticated.
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    // If authenticated, fetch the images.
    if (status === 'authenticated') {
      fetchImages();
    }
  }, [status, router]);

  // Fetch images function
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    }
  };


  const convertGDriveLink = (url) => {
    if (!url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/[-\w]{25,}/);
    if (!fileId) return url;
    
    return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const imageData = {
      ...formData,
      imageUrl: convertGDriveLink(formData.imageUrl)
    };

    try {
      const url = isEditMode 
        ? `/api/admin/gallery/${currentImage.id}` 
        : '/api/admin/gallery';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData)
      });

      if (!response.ok) throw new Error('Failed to save image');

      setSuccess(isEditMode ? 'Image updated successfully' : 'Image added successfully');
      fetchImages();
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (image) => {
    setIsEditMode(true);
    setCurrentImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      description: image.description || '',
      academicYear: image.academicYear,
      tags: image.tags || [],
      in_carousal: image.in_carousal
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete image');

      setSuccess('Image deleted successfully');
      fetchImages();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      description: '',
      academicYear: new Date().getFullYear().toString(),
      tags: [],
      in_carousal: false
    });
    setIsEditMode(false);
    setCurrentImage(null);
    setTagInput('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Gallery</h1>
          {isEditMode && (
            <Button variant="outline" onClick={resetForm}>
              Add New Image
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
            <CardTitle>{isEditMode ? 'Edit Image' : 'Add New Image'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Google Drive)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Press Enter to add tags"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="in_carousal"
                    checked={formData.in_carousal}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, in_carousal: checked }))
                    }
                  />
                  <Label htmlFor="in_carousal">Show in Grid</Label>
                </div>
              </div>

              {formData.imageUrl && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={convertGDriveLink(formData.imageUrl)}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {isEditMode && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditMode ? 'Update Image' : 'Add Image'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={image.imageUrl}
                      alt={image.description || 'Gallery image'}
                      fill
                      className="object-cover"
                      priority={false}
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(image.imageUrl, '_blank')}
                      className="bg-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(image)}
                      className="bg-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(image.id)}
                      className="bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.in_carousal && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      Grid
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-sm text-gray-600">{image.academicYear}</p>
                    {image.description && (
                      <p className="text-sm mt-1">{image.description}</p>
                    )}
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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