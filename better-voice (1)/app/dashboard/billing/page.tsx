import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default async function Billing() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Free plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium">Free Plan</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Up to 3 feedback boxes</li>
                    <li>• 100 submissions per month</li>
                    <li>• Basic analytics</li>
                    <li>• Email support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Upgrade Plan</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Choose a plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="free">
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex-1">
                    <div>
                      <p className="font-medium">Free</p>
                      <p className="text-sm text-muted-foreground">$0/month</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="pro" id="pro" />
                  <Label htmlFor="pro" className="flex-1">
                    <div>
                      <p className="font-medium">Pro</p>
                      <p className="text-sm text-muted-foreground">$19/month</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="flex-1">
                    <div>
                      <p className="font-medium">Business</p>
                      <p className="text-sm text-muted-foreground">$49/month</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button>Change Plan</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No payment methods added yet.</p>
            </CardContent>
            <CardFooter>
              <Button>Add Payment Method</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
