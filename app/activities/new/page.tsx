"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';

interface ActivityType {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  fullName: string;
  acronym?: string;
}

interface ActivityFormData {
  title: string;
  description?: string;
  activityTypeId: string;
  date: string;
  duration?: number;
  location?: string;
  website?: string;
  organizationId?: number;
}

export default function NewActivityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, control } = useForm<ActivityFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, orgsResponse] = await Promise.all([
          fetch('/api/activity-types'),
          fetch('/api/organization-list')
        ]);

        if (!typesResponse.ok || !orgsResponse.ok) {
          throw new Error('Failed to fetch required data');
        }

        const types = await typesResponse.json();
        const orgs = await orgsResponse.json();
        
        setActivityTypes(types);
        setOrganizations(orgs);
      } catch (error) {
        toast.error('Failed to load required data');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setIsSubmitting(true);
      
      const formattedData = {
        ...data,
        activityTypeId: parseInt(data.activityTypeId),
        date: new Date(data.date),
        duration: data.duration ? parseInt(data.duration.toString()) : undefined,
        organizationId: data.organizationId ? parseInt(data.organizationId.toString()) : undefined,
      };

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create activity');
      }

      toast.success('Activity created successfully');
      router.push('/activities');
    } catch (error) {
      toast.error(error.message || 'Failed to create activity');
      console.error('Error creating activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const organizationOptions = organizations.map(org => ({
    value: org.id.toString(),
    label: org.acronym ? `${org.fullName} (${org.acronym})` : org.fullName
  }));

  return (
    <div className="form-container">
      <h1 className="form-header">Create New Activity</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        <div>
          <label className="form-label">Title</label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="Activity title"
            className="form-input"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register('description')}
            className="form-input min-h-[100px]"
            placeholder="Activity description"
          />
        </div>

        <div>
          <label className="form-label">Activity Type</label>
          <select
            {...register('activityTypeId', { required: 'Activity type is required' })}
            className="form-select"
          >
            <option value="">Select activity type</option>
            {activityTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.activityTypeId && (
            <p className="text-red-500 text-sm mt-1">{errors.activityTypeId.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Organization</label>
          <Select
            options={organizationOptions}
            onChange={(option) => {
              const event = {
                target: { name: 'organizationId', value: option?.value }
              };
              register('organizationId').onChange(event);
            }}
            className="react-select text-slate-950"
            classNamePrefix="react-select"
            placeholder="Select organization..."
            isClearable
            isDisabled={isSubmitting}
          />
        </div>

        <div>
          <label className="form-label">Date and Time</label>
          <Input
            type="datetime-local"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Duration (minutes)</label>
          <Input
            type="number"
            {...register('duration')}
            placeholder="Duration in minutes"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Location</label>
          <Input
            {...register('location')}
            placeholder="Physical location or virtual meeting URL"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Website</label>
          <Input
            type="url"
            {...register('website')}
            placeholder="https://example.com"
            className="form-input"
          />
        </div>

        <div className="form-buttons">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Activity'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}