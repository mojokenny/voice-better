"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface FeedbackBox {
  id: string
  name: string
  description: string | null
}

export default function EditBox({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [box, setBox] = useState<FeedbackBox | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const response = await fetch(`/api/boxes/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch feedback box")
        }

        const data = await response.json()
        setBox(data)
        setName(data.name)
        setDescription(data.description || "")
      } catch (error: any) {
        setError(error.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBox()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/boxes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update feedback box")
      }

      router.push(`/dashboard/boxes/${params.id}`)
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="mb-8">
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
      </DashboardLayout>
    )
  }

  if (error && !box) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/boxes")}>
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Feedback Box</h1>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Edit Feedback Box</CardTitle>
            <CardDescription>Update the details of your feedback box</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Customer Feedback"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this feedback box"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href={`/dashboard/boxes/${params.id}`}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
