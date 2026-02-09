import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ShowUsersSkeleton from "@/components/skeleton/ShowUsersSkeleton";
import UsersShowContent from "@/components/UserProfile/UsersShowContent";
import { useUserByUuid } from "@/hooks/useUser";
import { useParams } from "react-router-dom";

export default function UsersShow() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: userFromApi, isLoading: isFetchingUser } = useUserByUuid(
    uuid || "",
  );

  return (
    <>
      <PageMeta title="Show Users" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Users", href: "/users" },
          { name: "Profile" }, // Saya ubah jadi Profile agar konsisten
        ]}
      />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        {isFetchingUser ? (
          <ShowUsersSkeleton />
        ) : (
          <div className="space-y-6">
            <UsersShowContent user={userFromApi} />
          </div>
        )}
      </div>
    </>
  );
}