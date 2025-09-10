import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive";
  className?: string;
}

export function ErrorMessage({
  title,
  message,
  variant = "destructive",
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4",
        variant === "destructive" && "bg-red-50 text-red-700 border border-red-200",
        variant === "default" && "bg-gray-50 text-gray-700 border border-gray-200",
        className
      )}
    >
      {title && (
        <h3 className="font-semibold mb-1">{title}</h3>
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ErrorPage({
  title = "Something went wrong",
  message,
  showRetry = false,
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}