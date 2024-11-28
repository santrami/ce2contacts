"use client"

import { useState, useEffect } from "react"
import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChromePicker } from "react-color"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

interface TagData {
  id: number
  name: string
  color: string
}

interface TagManagerProps {
  entityId: number
  entityType: "contact" | "organization"
  initialTags?: TagData[]
  onTagsUpdate?: (tags: TagData[]) => void
}

export function TagManager({ 
  entityId, 
  entityType, 
  initialTags = [],
  onTagsUpdate 
}: TagManagerProps) {
  const { data: session } = useSession()
  const [tags, setTags] = useState<TagData[]>(initialTags)
  const [newTagName, setNewTagName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#6366F1")
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    // Fetch current tags when component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch(`/api/tags?entityId=${entityId}&entityType=${entityType}`);
        if (!response.ok) throw new Error('Failed to fetch tags');
        const fetchedTags = await response.json();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [entityId, entityType]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: selectedColor,
          entityId,
          entityType,
        }),
      })

      if (!response.ok) throw new Error("Failed to create tag")

      const newTag = await response.json()
      const updatedTags = [...tags, newTag]
      setTags(updatedTags)
      onTagsUpdate?.(updatedTags)
      setNewTagName("")
      toast.success("Tag added successfully")
    } catch (error) {
      toast.error("Failed to add tag")
      console.error("Error adding tag:", error)
    }
  }

  const handleRemoveTag = async (tagId: number) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityId,
          entityType,
        }),
      })

      if (!response.ok) throw new Error("Failed to remove tag")

      const updatedTags = tags.filter(tag => tag.id !== tagId)
      setTags(updatedTags)
      onTagsUpdate?.(updatedTags)
      toast.success("Tag removed successfully")
    } catch (error) {
      toast.error("Failed to remove tag")
      console.error("Error removing tag:", error)
    }
  }

  if (!session?.user) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            removable
            onRemove={() => handleRemoveTag(tag.id)}
            color={tag.color}
          >
            {tag.name}
          </Tag>
        ))}
      </div>

      <div className="flex gap-2 text-stone-950">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
          className="max-w-[200px]"
        />
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ backgroundColor: selectedColor }}
            className="w-10 p-0"
          >
            <span className="sr-only">Pick color</span>
          </Button>
          {showColorPicker && (
            <div className="absolute z-10 mt-2">
              <div
                className="fixed inset-0"
                onClick={() => setShowColorPicker(false)}
              />
              <ChromePicker
                color={selectedColor}
                onChange={(color) => setSelectedColor(color.hex)}
              />
            </div>
          )}
        </div>
        <Button onClick={handleAddTag}>Add Tag</Button>
      </div>
    </div>
  )
}