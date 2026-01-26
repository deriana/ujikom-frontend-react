interface TableSkeletonProps {
  rows?: number;
  cols: number;
}

export default function TableSkeleton({ rows = 5, cols }: TableSkeletonProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b dark:border-white/5">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-5 py-3">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
