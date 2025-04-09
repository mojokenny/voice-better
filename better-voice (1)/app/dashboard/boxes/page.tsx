import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateQRCode } from "@/lib/jotform"

export default async function Boxes() {
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
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Feedback Boxes</h1>
          <Link href="/dashboard/boxes/new">
            <Button>Create New Box</Button>
          </Link>
        </div>

        {boxes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {boxes.map((box) => {
              const qrCodeUrl = generateQRCode(box.formId)
              const formUrl = `https://form.jotform.com/${box.formId}`

              return (
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
                    <div className="mb-4">
                      <p className="text-sm font-medium">QR Code</p>
                      <div className="mt-2 flex justify-center">
                        <img
                          src={qrCodeUrl || "/placeholder.svg"}
                          alt={`QR Code for ${box.name}`}
                          className="h-32 w-32"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium">Form Link</p>
                      <p className="mt-1 truncate rounded-md bg-muted p-2 text-xs">{formUrl}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/dashboard/boxes/${box.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={formUrl} target="_blank">
                      <Button size="sm">Open Form</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
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
    </DashboardLayout>
  )
}
