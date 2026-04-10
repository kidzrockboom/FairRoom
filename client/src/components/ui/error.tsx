import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorBlock({ message, onRetry, className }: ErrorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}>
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
