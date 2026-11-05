import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: () => <p className="text-muted-foreground p-6">Select a conversation</p>,
})
