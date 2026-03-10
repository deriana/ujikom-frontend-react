import { useIsMobile } from "@/hooks/useIsMobile";
import { Link } from "react-router-dom";
import PageHeader from "../Mobile/PageHeader";

interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  pageTitle?: string;
  crumbs?: Crumb[];
  hideItem?: boolean;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  crumbs,
  hideItem = false,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <PageHeader
        to="/home"
        title={pageTitle || "Page"}
        subtitle={`${pageTitle} Management`}
        align="center"
        hideItem={hideItem}
      />
    );
  }

  const items = crumbs ?? [
    { name: "Home", href: "/" },
    { name: pageTitle || "Page" },
  ];

  return (
    <div className="flex justify-start sm:justify-end mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          {items.map((crumb, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {crumb.href && !isLast ? (
                  <Link
                    to={crumb.href}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {crumb.name}
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {crumb.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
