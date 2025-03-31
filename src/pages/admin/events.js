import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function EventsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    year: new Date().getFullYear().toString(),
    status: 'upcoming',
    registrationLink: '',
    eventImage: '',
    conductedBy: 'CSEA',
    teamSizeMin: 1,
    teamSizeMax: 1,
    participantsCount: 0,
    in_carousal: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect or fetch events based on authentication status
  useEffect(() => {
    // Wait until NextAuth finishes loading
    if (status === 'loading') return;

    // If unauthenticated, redirect to login
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    // If authenticated, fetch events
    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, router]);

  // Function to fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
    }
  };

  

  const convertGDriveLink = (url) => {
    if (!url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/[-\w]{25,}/);
    if (!fileId) return url;
    
    return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateSelect = (date) => {
    if (date) {
      setFormData(prev => ({ ...prev, date: date.toISOString() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const eventData = {
      ...formData,
      date: formData.date instanceof Date ? formData.date.toISOString() : new Date(formData.date).toISOString(), 
      eventImage: convertGDriveLink(formData.eventImage)
    };

    try {
      const url = isEditMode 
        ? `/api/admin/events/${currentEvent.id}` 
        : '/api/admin/events';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) throw new Error('Failed to save event');

      setSuccess(isEditMode ? 'Event updated successfully' : 'Event created successfully');
      fetchEvents();
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (event) => {
    setIsEditMode(true);
    setCurrentEvent(event);
    setFormData({
      ...event,
      date: event.date ? new Date(event.date) : new Date(), // Ensure date is a Date object
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete event');

      setSuccess('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: new Date(),
      year: new Date().getFullYear().toString(),
      status: 'upcoming',
      registrationLink: '',
      eventImage: '',
      conductedBy: 'IEEE',
      teamSizeMin: 1,
      teamSizeMax: 1,
      in_carousal: false
    });
    setIsEditMode(false);
    setCurrentEvent(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Events</h1>
          {isEditMode && (
            <Button variant="outline" onClick={resetForm}>
              Add New Event
            </Button>
          )}
        </div>

        {/* Alerts */}
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

        {/* Event Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Event' : 'Add New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Conducted By */}
                <div className="space-y-2">
                  <Label htmlFor="conductedBy">Conducted By</Label>
                  <Input
                    id="conductedBy"
                    name="conductedBy"
                    value={formData.conductedBy}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Event Date */}
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto h-auto p-0 z-50">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Size */}
                <div className="space-y-2">
                  <Label htmlFor="teamSizeMin">Minimum Team Size</Label>
                  <Input
                    type="number"
                    id="teamSizeMin"
                    name="teamSizeMin"
                    value={formData.teamSizeMin}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSizeMax">Maximum Team Size</Label>
                  <Input
                    type="number"
                    id="teamSizeMax"
                    name="teamSizeMax"
                    value={formData.teamSizeMax}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                {/* Registration Link */}
                <div className="space-y-2">
                  <Label htmlFor="registrationLink">Registration Link</Label>
                  <Input
                    id="registrationLink"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Event Image */}
                <div className="space-y-2">
                  <Label htmlFor="eventImage">Event Image URL</Label>
                  <Input
                    id="eventImage"
                    name="eventImage"
                    value={formData.eventImage}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Participant Count */}
                <div className="space-y-2">
                  <Label htmlFor="participantsCount">Number of Participants</Label>
                  <Input
                    type="number"
                    id="participantsCount"
                    name="participantsCount"
                    value={formData.participantsCount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                {/* Carousel Toggle */}
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
  
</div>


              {/* Description */}
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

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                {isEditMode && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Events */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.slice().reverse().map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(event.date), 'PPP')} - {event.status}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {event.eventImage && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(event.eventImage, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
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