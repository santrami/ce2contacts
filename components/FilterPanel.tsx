"use client";

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import Select from "react-select"
import Spinner from "./Spinner"

interface FilterPanelProps {
  sectors?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Array<{ id: number; name: string; color: string }>>([]);
  const [sectors, setSectors] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    sector: searchParams?.get("sector") || "",
    tags: searchParams?.get("tags")?.split(",").filter(Boolean) || []
  });

  // Fetch sectors
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sectors');
        if (!response.ok) throw new Error('Failed to fetch sectors');
        const data = await response.json();
        setSectors(data);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  // Update URL with current filters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString());

    // Add or remove filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  }, [filters, router, searchParams]);

  // Handle individual filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || (key === 'tags' ? [] : "")
    }));
  };

  // Effect to update URL when filters change
  useEffect(() => {
    updateUrl();
  }, [filters, updateUrl]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags/available');
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sector: "",
      tags: []
    });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  const sectorOptions = sectors.map(s => ({
    value: s.id.toString(),
    label: s.name
  }));

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between bg-white text-gray-900">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select
                options={sectorOptions}
                value={sectorOptions.find(s => s.value === filters.sector)}
                onChange={(option) => handleFilterChange("sector", option?.value)}
                isClearable
                placeholder="Select sector..."
                className="text-black"
                classNamePrefix="react-select"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Select
                isMulti
                options={tags.map(t => ({ 
                  value: t.id.toString(), 
                  label: t.name,
                  color: t.color 
                }))}
                value={tags
                  .map(t => ({ value: t.id.toString(), label: t.name }))
                  .filter(t => filters.tags.includes(t.value))}
                onChange={(options) => handleFilterChange("tags", options?.map(o => o.value) || [])}
                isClearable
                placeholder="Select tags..."
                className="text-black"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Clear Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}