interface CategoriesMarketplaceProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoriesMarketplace({
  activeCategory,
  onCategoryChange,
}: CategoriesMarketplaceProps) {
  const categories = ["All", "Voucher", "Power-Up", "Goods"];

  return (
    <div className="px-6 mb-6 flex gap-3 overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full border text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
            activeCategory === cat
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white dark:bg-gray-900 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}