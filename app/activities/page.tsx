"use client";

import { useEffect, useState } from 'react';
import { ActivityList } from '@/components/ActivityList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ActivityFilters } from '@/components/ActivityFilters';
import Spinner from '@/components/Spinner';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const queryString = searchParams?.toString();
        const url = `/api/activities${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [searchParams]);

  const handleFiltersChange = (filters: any) => {
    // Filters are handled through URL params and useEffect
    console.log('Filters changed:', filters);
  };

  if (error) return (
    <div className="text-center p-4 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Link href="/activities/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </Link>
      </div>

      <ActivityFilters onFiltersChange={handleFiltersChange} />

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : (
        <ActivityList activities={activities} />
      )}
    </div>
  );
}