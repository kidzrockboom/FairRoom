import { cn } from "@/lib/utils";

type LoadingSize = "sm" | "md" | "lg";

type LoadingProps = {
  size?: LoadingSize;
  message?: string;
  className?: string;
};

const sizeClasses: Record<LoadingSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function Loading({ size = "md", message, className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <span
        className={cn(
          "animate-spin rounded-full border-border border-t-content",
          sizeClasses[size],
        )}
        role="status"
        aria-label={message ?? "Loading"}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
