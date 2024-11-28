"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Activity } from '@prisma/client';
import { FileDown } from 'lucide-react';
import { CSVLink } from 'react-csv';
import Spinner from '@/components/Spinner';

interface ActivityWithRelations extends Activity {
  activityType: { name: string };
  organization: { fullName: string } | null;
  participants: Array<{
    contact: {
      name: string;
      email: string;
      organization?: {
        fullName: string;
      } | null;
    }
  }>;
}

export default function ActivityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${params?.id}`);
        if (!response.ok) throw new Error('Failed to fetch activity');
        const data = await response.json();
        setActivity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchActivity();
    }
  }, [params?.id]);

  const getCSVData = () => {
    if (!activity) return [];
    
    const headers = [
      "Name",
      "Email",
      "Organization",
      "Role",
      "Attendance"
    ];

    const data = activity.participants.map(p => [
      p.contact.name,
      p.contact.email,
      p.contact.organization?.fullName || 'N/A',
      //@ts-ignore
      p.role || 'Participant',
      //@ts-ignore
      p.attendance ? 'Yes' : 'No'
    ]);

    return [headers, ...data];
  };

  if (loading) return (
    <div className="flex justify-center p-8">
      <Spinner />
    </div>
  );
  
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!activity) return <div className="text-center p-4">Activity not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{activity.title}</h1>
            <p className="text-gray-400">{activity.activityType.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CSVLink
                data={getCSVData()}
                filename={`participants_${activity.title}_${format(new Date(activity.date), 'yyyy-MM-dd')}.csv`}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Download Participants
              </CSVLink>
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/activities/${activity.id}/edit`)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-gray-400">Date</dt>
                <dd>{format(new Date(activity.date), 'PPP')}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Duration</dt>
                <dd>{activity.duration} minutes</dd>
              </div>
              <div>
                <dt className="text-gray-400">Location</dt>
                <dd>{activity.location || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Organization</dt>
                <dd>{activity.organization?.fullName || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-300">{activity.description || 'No description provided'}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Participants ({activity.participants.length})</h3>
            <Button onClick={() => router.push(`/activities/${activity.id}/participants`)}>
              Add Participant
            </Button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            {activity.participants.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {activity.participants.map((participant, index) => (
                  <div key={index} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{participant.contact.name}</p>
                      <p className="text-sm text-gray-400">{participant.contact.email}</p>
                      {participant.contact.organization && (
                        <p className="text-sm text-gray-400">{participant.contact.organization.fullName}</p>
                      )}
                    </div>
                    <div className="text-right">
                        {/* @ts-ignore */}
                      <p className="text-sm font-medium">{participant.role || 'Participant'}</p>
                      {/* @ts-ignore */}
                      {participant.attendance !== null && (
                        <p className="text-sm text-gray-400">
                            {/* @ts-ignore */}
                          {participant.attendance ? 'Attended' : 'Did not attend'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No participants yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}