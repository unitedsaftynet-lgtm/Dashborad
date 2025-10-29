import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold" data-testid="text-404">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link href="/dashboard">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 h-11 font-medium hover-elevate active-elevate-2" data-testid="button-home">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
