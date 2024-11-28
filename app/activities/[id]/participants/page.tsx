"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Spinner from '@/components/Spinner';

interface Contact {
  id: number;
  name: string;
  email: string;
}

interface ParticipantFormData {
  contactId: number;
  role?: string;
}

export default function ManageParticipantsPage() {
  const router = useRouter();
  const params = useParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [role, setRole] = useState<string>('participant');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();
        setContacts(data || []);
      } catch (error) {
        toast.error('Failed to load contacts');
        console.error('Error loading contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) {
      toast.error('Please select a contact');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/activities/${params?.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedContact,
          role
        }),
      });

      if (!response.ok) throw new Error('Failed to add participant');

      toast.success('Participant added successfully');
      router.push(`/activities/${params?.id}`);
    } catch (error) {
      toast.error('Failed to add participant');
      console.error('Error adding participant:', error);
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

  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} (${contact.email})`
  }));

  return (
    <div className="form-container">
      <h1 className="form-header">Add Participant</h1>
      
      <form onSubmit={handleSubmit} className="form-group">
        <div>
          <label className="form-label">Contact</label>
          <Select
            options={contactOptions}
            onChange={(option) => setSelectedContact(option?.value || null)}
            className="react-select text-gray-950"
            classNamePrefix="react-select"
            placeholder="Select a contact..."
            isDisabled={isSubmitting}
          />
        </div>

        <div>
          <label className="form-label">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value="participant">Participant</option>
            <option value="presenter">Presenter</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div className="form-buttons">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Participant'}
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