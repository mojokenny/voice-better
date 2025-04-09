import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get all feedback boxes
  const boxes = await prisma.feedbackBox.findMany({
    where: {
      userId: user.id,
    },
    include: {
      submissions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get recent submissions
  const recentSubmissions = await prisma.submission.findMany({
    where: {
      feedbackBox: {
        userId: user.id,
      },
    },
    include: {
      feedbackBox: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/dashboard/boxes/new">
            <Button>Create New Box</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Feedback Boxes</CardTitle>
              <CardDescription>Number of feedback boxes you've created</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{boxes.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Submissions</CardTitle>
              <CardDescription>Number of feedback submissions received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{boxes.reduce((acc, box) => acc + box.submissions.length, 0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <ul className="space-y-2">
                  {recentSubmissions.map((submission) => (
                    <li key={submission.id} className="rounded-md bg-muted p-2">
                      <p className="font-medium">{submission.feedbackBox.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No recent submissions</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Your Feedback Boxes</h2>
          {boxes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boxes.map((box) => (
                <Card key={box.id}>
                  <CardHeader>
                    <CardTitle>{box.name}</CardTitle>
                    <CardDescription>{box.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-2xl font-bold">{box.submissions.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/boxes/${box.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`https://form.jotform.com/${box.formId}`} target="_blank">
                        <Button size="sm">Open Form</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="mb-4 text-center text-muted-foreground">You haven't created any feedback boxes yet.</p>
                <Link href="/dashboard/boxes/new">
                  <Button>Create Your First Box</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
