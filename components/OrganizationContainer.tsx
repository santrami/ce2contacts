import { useState, useEffect } from 'react';
import { OrganizationList } from './OrganizationList';
import Spinner from './Spinner';
import { useRouter, useSearchParams } from 'next/navigation';

export function OrganizationContainer() {
  const [organizations, setOrganizations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const page = parseInt(searchParams?.get('page') || '1');
        const sector = searchParams?.get('sector');
        const tags = searchParams?.get('tags');
        
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        if (sector) queryParams.set('sector', sector);
        if (tags) queryParams.set('tags', tags);
        
        const response = await fetch(`/api/organization?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = await response.json();
        
        if (!data.organizations || !Array.isArray(data.organizations)) {
          throw new Error('Invalid data format received');
        }

        setOrganizations(data.organizations);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError('Failed to load organizations. Please try again.');
        
        // Retry logic
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff
        }
      }
    };

    fetchOrganizations();
  }, [searchParams, retryCount]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.pathname + url.search);
  };

  const handleTagsUpdate = async (organizationId: number, updatedTags: any[]) => {
    try {
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === organizationId ? { ...org, tags: updatedTags } : org
        )
      );

      const response = await fetch(`/api/organization/${organizationId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh organization data');
      }
      
      const updatedOrg = await response.json();
      setOrganizations(prevOrgs =>
        prevOrgs.map(org =>
          org.id === organizationId ? { ...org, tags: updatedOrg.tags } : org
        )
      );
    } catch (error) {
      console.error('Error updating tags:', error);
      setError('Failed to update tags. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <button 
          onClick={() => {
            setRetryCount(0);
            setError(null);
          }} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <OrganizationList
      organizations={organizations}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onTagsUpdate={handleTagsUpdate}
    />
  );
}