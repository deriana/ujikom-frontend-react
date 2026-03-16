import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast"; // misal pakai react-hot-toast
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ShowUsersSkeleton from "@/components/skeleton/ShowUsersSkeleton";
import EditProfilePhotoModal from "@/components/UserProfile/EditProfilePhotoModal";
import UsersShowContent from "@/components/UserProfile/UsersShowContent";
import { useUploadProfilePhoto, useUserByUuid, } from "@/hooks/useUser";

export default function UsersShow() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: userFromApi, isLoading: isFetchingUser, refetch } = useUserByUuid(uuid || "");
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const { mutateAsync: uploadProfilePhoto } = useUploadProfilePhoto();


  // Buka modal
  const handleOpenPhotoModal = () => setPhotoModalOpen(true);

  // Upload / remove handler dengan toast
  const handleUploadPhoto = async (file: File | null) => {
    if (!uuid) return;
    setLoadingPhoto(true);

    try {
      if (file) {
        await toast.promise(
          uploadProfilePhoto({ uuid, file }),
          {
            loading: "Uploading photo...",
            success: "Profile photo updated!",
            error: "Failed to upload photo",
          }
        );
      } else {
        await toast.promise(
          uploadProfilePhoto({ uuid, file: new File([], "") }),
          {
            loading: "Removing photo...",
            success: "Profile photo removed!",
            error: "Failed to remove photo",
          }
        );
      }

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPhoto(false);
      setPhotoModalOpen(false);
    }
  };

  return (
    <>
      <PageMeta title="Show Users" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Users", href: "/users" },
          { name: "Profile" },
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
            <UsersShowContent
              user={userFromApi}
              onChangePhoto={handleOpenPhotoModal}
            />

            <EditProfilePhotoModal
              isOpen={isPhotoModalOpen}
              onClose={() => setPhotoModalOpen(false)}
              currentPhoto={userFromApi?.employee?.profile_photo}
              onUpload={handleUploadPhoto}
              isLoading={loadingPhoto}
            />
          </div>
        )}
      </div>
    </>
  );
}
