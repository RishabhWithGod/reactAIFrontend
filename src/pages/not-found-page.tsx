import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/dashboard/page-shell'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <PageShell
      eyebrow="404"
      title="This workspace route does not exist"
      description="The requested page was not found in the analyzer dashboard. Jump back to the overview or start a fresh upload."
      actions={
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      }
    >
      <div />
    </PageShell>
  )
}
