interface FieldSkeleton {
  type?: "input" | "select" | "textarea" | "checkbox" | "date";
  width?: string;
  rows?: number; 
}

interface FormSkeletonProps {
  fields: FieldSkeleton[];
}

export default function FormSkeleton({ fields }: FormSkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          {/* Label skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3"></div>

          {/* Field skeleton */}
          {field.type === "textarea" ? (
            <div
              className={`bg-gray-200 dark:bg-white/10 rounded ${
                field.width || "w-full"
              } h-${field.rows ? field.rows * 4 : 12} px-3 py-2`}
            />
          ) : (
            <div
              className={`h-10 bg-gray-200 dark:bg-white/10 rounded ${
                field.width || "w-full"
              } px-3`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
