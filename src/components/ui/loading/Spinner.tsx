const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[var(--z-index-999999)] bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-950)]">
      <svg className="animate-rotate w-[55px] h-[55px]" viewBox="0 0 50 50">
        <circle
          className="path stroke-[var(--color-brand-500)] dark:stroke-[var(--color-brand-400)]"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
        ></circle>
      </svg>

      <style>{`
        .animate-rotate {
          animation: rotate 2s linear infinite;
        }

        .path {
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;