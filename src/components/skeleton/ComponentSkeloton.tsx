interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export default function Skeleton({
  className = "",
  variant = "rect",
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-white/10";

  const variantClasses = {
    circle: "rounded-full",
    rect: "rounded-xl",
    text: "rounded-md h-4 w-3/4",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return <div className={combinedClasses} {...props} />;
}