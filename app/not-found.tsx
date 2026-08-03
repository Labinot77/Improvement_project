"use client"

import { ArrowUpRightIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

 
export default function NotFound() {
  return (
 <Empty className='h-screen'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <X />
        </EmptyMedia>
        <EmptyTitle>Page not found</EmptyTitle>
        <EmptyDescription>
          The page you are looking for does not exist.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Home
        </Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
     
      </Button>
    </Empty> 
  )
}
