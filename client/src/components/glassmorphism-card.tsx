import { cn } from "@/lib/utils";

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: "normal" | "strong";
}

export function GlassmorphismCard({ 
  children, 
  className, 
  strength = "normal",
  ...props 
}: GlassmorphismCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50",
        strength === "strong" ? "glassmorphism-strong" : "glassmorphism",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
