import { ShoppingBag } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center w-full col-span-full">
      <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        No items found
      </h3>
      <p className="text-sm text-gray-500">
        Try adjusting your search or filters
      </p>
    </div>
  );
}