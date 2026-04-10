import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyAction = {
  label: string;
  onClick: () => void;
};

type EmptyProps = {
  title: string;
  description?: string;
  action?: EmptyAction;
  className?: string;
};

export default function Empty({ title, description, action, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 text-center", className)}>
      <p className="text-base font-semibold text-content">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  );
}
