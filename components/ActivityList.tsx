import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Activity } from '@prisma/client';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

interface ActivityWithRelations extends Activity {
  activityType: { name: string };
  organization: { fullName: string } | null;
  participants: Array<{
    contact: {
      name: string;
      email: string;
    }
  }>;
}

interface ActivityListProps {
  activities: ActivityWithRelations[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (!activities.length) {
    return <div className="text-center p-4">No activities found</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-sm text-gray-400">{activity.activityType.name}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/activities/${activity.id}/participants`}>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Participant
                </Button>
              </Link>
              <Link href={`/activities/${activity.id}`}>
                <Button variant="secondary" size="sm">View Details</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p>{format(new Date(activity.date), 'PPP')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Duration</p>
              <p>{activity.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Organization</p>
              <p>{activity.organization?.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Participants</p>
              <p>{activity.participants.length}</p>
            </div>
          </div>

          {activity.description && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">Description</p>
              <p className="text-sm">{activity.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}