"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import Select from "react-select"

interface FilterPanelProps {
  sectors: Array<{ id: number; name: string }>
}

export function FilterPanel({ sectors }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    sector: searchParams?.get("sector") || "",
  })

  // Update URL with current filters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()

    // Add filter parameters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      }
    })

    // Only navigate if there are actual filters
    if (params.toString()) {
      router.push(`/?${params.toString()}`)
    } else {
      router.push('/')
    }
  }, [filters, router])

  // Handle individual filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || ""
    }))
  }

  // Effect to update URL when filters change
  useEffect(() => {
    updateUrl()
  }, [filters, updateUrl])

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sector: "",
    })
    router.push('/')
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select
                options={sectors.map(s => ({ value: s.id.toString(), label: s.name }))}
                value={sectors
                  .map(s => ({ value: s.id.toString(), label: s.name }))
                  .find(s => s.value === filters.sector)}
                onChange={(option) => handleFilterChange("sector", option?.value)}
                isClearable
                placeholder="Select sector..."
                className="text-black"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}