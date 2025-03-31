import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, CheckCircle, XCircle } from 'lucide-react';


export default function ContactMessagesAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Wait for the session status to be determined
    if (status === 'loading') return;
    
    // Redirect to login if unauthenticated
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    // If authenticated, fetch messages
    if (status === 'authenticated') {
      fetchMessages();
    }
  }, [status, router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    }
  };

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update message status');

      setSuccess('Message status updated successfully');
      fetchMessages();
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      read: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      resolved: 'bg-green-100 text-green-800 hover:bg-green-200'
    };

    return (
      <Badge className={styles[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contact Messages</h1>
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
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{message.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        From: {message.name} ({message.email})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Received: {format(new Date(message.submittedAt), 'PPp')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(message.status)}
                    </div>
                  </div>
                  <p className="text-sm mb-4 whitespace-pre-wrap">{message.message}</p>
                  <div className="flex justify-end space-x-2">
                    {message.status === 'unread' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(message.id, 'read')}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    {message.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(message.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}
                    {message.status === 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(message.id, 'unread')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}