"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Spinner from '@/components/Spinner';

interface ActivityFormData {
  title: string;
  description?: string;
  activityTypeId: number;
  date: string;
  duration?: number;
  location?: string;
  organizationId?: number;
}

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityFormData>();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${params?.id}`);
        if (!response.ok) throw new Error('Failed to fetch activity');
        const activity = await response.json();
        
        reset({
          ...activity,
          date: format(new Date(activity.date), "yyyy-MM-dd'T'HH:mm"),
        });
      } catch (error) {
        toast.error('Failed to load activity');
        console.error('Error loading activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchActivity();
    }
  }, [params?.id, reset]);

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/activities/${params?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: new Date(data.date),
          duration: data.duration ? parseInt(data.duration.toString()) : undefined,
          organizationId: data.organizationId ? parseInt(data.organizationId.toString()) : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update activity');

      toast.success('Activity updated successfully');
      router.push('/activities');
    } catch (error) {
      toast.error('Failed to update activity');
      console.error('Error updating activity:', error);
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

  return (
    <div className="form-container">
      <h1 className="form-header">Edit Activity</h1>
      
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
            <option value="1">Webinar</option>
            <option value="2">Workshop</option>
            <option value="4">Survey</option>
            <option value="3">Interview</option>
            <option value="5">Focus Group</option>
          </select>
          {errors.activityTypeId && (
            <p className="text-red-500 text-sm mt-1">{errors.activityTypeId.message}</p>
          )}
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
          <label className="form-label">Location or URL</label>
          <Input
            {...register('location')}
            placeholder="Physical location or virtual meeting URL"
            className="form-input"
          />
        </div>

        <div className="form-buttons">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}