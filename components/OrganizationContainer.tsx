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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const page = parseInt(searchParams?.get('page') || '1');
        const sector = searchParams?.get('sector');
        
        const response = await fetch(`/api/organization?page=${page}${sector ? `&sector=${sector}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = await response.json();
        
        setOrganizations(data.organizations);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError('Failed to load organizations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [searchParams]);

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
    }
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <button 
          onClick={() => window.location.reload()} 
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