"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Spinner from './Spinner';

interface ActivityType {
  id: number;
  name: string;
}

interface ActivityFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function ActivityFilters({ onFiltersChange }: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams?.get('type') || '',
    from: searchParams?.get('from') || '',
    to: searchParams?.get('to') || '',
  });

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await fetch('/api/activity-types');
        if (!response.ok) throw new Error('Failed to fetch activity types');
        const data = await response.json();
        setActivityTypes(data);
      } catch (error) {
        console.error('Error fetching activity types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityTypes();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    // Update URL
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/activities?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      from: '',
      to: '',
    });
    onFiltersChange({});
    router.push('/activities');
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Activity Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full p-2 rounded-md bg-white text-black"
          >
            <option value="">All Types</option>
            {activityTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <Input
            type="date"
            value={filters.from}
            onChange={(e) => handleFilterChange('from', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <Input
            type="date"
            value={filters.to}
            onChange={(e) => handleFilterChange('to', e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}