import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LearnMore() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-xl font-bold">Better Voice</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12">
          <h1 className="mb-8 text-3xl font-bold">How Better Voice Can Help</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Small Businesses</CardTitle>
                <CardDescription>Collect valuable customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Small businesses can easily collect feedback from customers to improve services and address concerns
                  before they escalate to negative reviews.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HR Teams</CardTitle>
                <CardDescription>Create better work environments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  HR teams can gather anonymous feedback from employees to identify areas for improvement and create a
                  more positive workplace culture.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Teams</CardTitle>
                <CardDescription>Gather product feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Product teams can collect user feedback to inform product development decisions and prioritize
                  features that matter most to customers.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Industry</CardTitle>
                <CardDescription>Improve customer experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Restaurants, hotels, and service providers can add QR codes to receipts or confirmation emails for
                  immediate feedback collection.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Organizers</CardTitle>
                <CardDescription>Enhance future events</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Event organizers can gather attendee feedback to improve future events and create better experiences
                  for participants.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Institutions</CardTitle>
                <CardDescription>Improve learning experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Schools and universities can collect feedback from students and parents to enhance educational
                  experiences and address concerns.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to start collecting valuable feedback?</h2>
            <Link href="/register">
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
