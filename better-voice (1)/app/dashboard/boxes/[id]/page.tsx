"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FeedbackBox {
  id: string
  name: string
  description: string | null
  formId: string
  qrCodeUrl: string
}

interface Submission {
  id: string
  submissionId: string
  data: any
  createdAt: string
  feedbackBox: {
    id: string
    name: string
  }
}

export default function BoxDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [box, setBox] = useState<FeedbackBox | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch box details
        const boxResponse = await fetch(`/api/boxes/${params.id}`)

        if (!boxResponse.ok) {
          throw new Error("Failed to fetch feedback box")
        }

        const boxData = await boxResponse.json()
        setBox(boxData)

        // Fetch submissions
        const submissionsResponse = await fetch(`/api/submissions?boxId=${params.id}`)

        if (!submissionsResponse.ok) {
          throw new Error("Failed to fetch submissions")
        }

        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
      } catch (error: any) {
        setError(error.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/boxes/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete feedback box")
      }

      router.push("/dashboard/boxes")
    } catch (error: any) {
      setError(error.message || "Something went wrong")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
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

  if (!box) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="rounded-md bg-muted p-4">
            <p>Feedback box not found</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/boxes")}>
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const formUrl = `https://form.jotform.com/${box.formId}`

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{box.name}</h1>
          <div className="flex gap-2">
            <Link href={formUrl} target="_blank">
              <Button variant="outline">Open Form</Button>
            </Link>
            <Link href={`/dashboard/boxes/${params.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the feedback box and all associated
                    submissions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Box Details</CardTitle>
                  <CardDescription>Information about this feedback box</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="mt-1">{box.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="mt-1">{box.description || "No description"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Form Link</p>
                      <p className="mt-1 truncate rounded-md bg-muted p-2 text-xs">{formUrl}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(formUrl)
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code</CardTitle>
                  <CardDescription>Scan this QR code to access the feedback form</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <img
                    src={box.qrCodeUrl || "/placeholder.svg"}
                    alt={`QR Code for ${box.name}`}
                    className="h-48 w-48"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = box.qrCodeUrl
                      link.download = `${box.name.replace(/\s+/g, "-")}-qr-code.png`
                      link.click()
                    }}
                  >
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>View all feedback submissions for this box</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardHeader>
                          <CardTitle className="text-base">Submission {submission.submissionId}</CardTitle>
                          <CardDescription>{new Date(submission.createdAt).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">
                            {JSON.stringify(submission.data, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
