import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import {
  CalendarDays,
  Users,
  Trophy,
  Image,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    winners: 0,
    officeBearers: 0,
    messages: 0,
    magazines: 0
  });
  const [localSession, setLocalSession] = useState(null);

  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);

    // Wait for NextAuth to finish loading before making any redirection decisions
    if (status === "loading") return;

    // If user is unauthenticated, redirect them to login page
    if (status === "unauthenticated") {
      console.log("Redirecting to /admin/login...");
      router.replace("/admin/login");
      return;
    }

    // If user is authenticated but local session is not set, store it
    if (status === "authenticated" && !localSession) {
      console.log("Storing session locally");
      setLocalSession(session);
    }
  }, [status, router, session, localSession]);

  useEffect(() => {
    // Fetch dashboard stats only when session is confirmed
    if (status !== "authenticated") return;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [status]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const statCards = [
    { title: 'Total Events', value: stats.events, icon: CalendarDays },
    { title: 'Gallery Images', value: stats.gallery, icon: Image },
    { title: 'Office Bearers', value: stats.officeBearers, icon: Users },
    { title: 'Unread Messages', value: stats.messages, icon: MessageSquare },
    { title: 'Magazines', value: stats.magazines, icon: BookOpen }
  ];

  return (
    <div>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {localSession?.user?.username}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
            );
          })}
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
