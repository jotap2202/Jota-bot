import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-neutral-900 mb-2">404</h1>
          <p className="text-xl text-neutral-600">Page not found</p>
        </div>

        <p className="text-neutral-600 mb-8">
          The NFC card or page you're looking for doesn't exist or has been deactivated.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
