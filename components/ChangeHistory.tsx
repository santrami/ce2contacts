import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Change {
  id: number;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: number;
  createdAt: string;
}

interface ChangeHistoryProps {
  type: 'contact' | 'organization';
  id: number;
}

export function ChangeHistory({ type, id }: ChangeHistoryProps) {
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChanges = async () => {
      try {
        const response = await fetch(`/api/changes?type=${type}&id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch changes');
        const data = await response.json();
        setChanges(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChanges();
  }, [type, id]);

  if (loading) return <div>Loading changes...</div>;
  if (error) return <div>Error: {error}</div>;
  if (changes.length === 0) return <div>No changes recorded</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Change History</h3>
      <div className="space-y-2">
        {changes.map((change) => (
          <div key={change.id} className="p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{format(new Date(change.createdAt), 'PPpp')}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">{change.field}</span>
              <div className="mt-1 text-sm">
                <div className="text-red-400">- {change.oldValue || '(empty)'}</div>
                <div className="text-green-400">+ {change.newValue || '(empty)'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}