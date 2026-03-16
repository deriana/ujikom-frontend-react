import { useState } from "react";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ShowUsersSkeleton from "@/components/skeleton/ShowUsersSkeleton";
import EditProfilePhotoModal from "@/components/UserProfile/EditProfilePhotoModal";
import { useGetProfile, useUploadProfilePhoto } from "@/hooks/useUser";
import ProfileContent from "@/components/UserProfile/ProfileContent";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Profile() {
  const {
    data: profileData,
    isLoading: isFetchingUser,
    refetch,
  } = useGetProfile();
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const { mutateAsync: uploadProfilePhoto } = useUploadProfilePhoto();

  const handleOpenPhotoModal = () => setPhotoModalOpen(true);

  const handleUploadPhoto = async (file: File | null) => {
    if (!profileData?.uuid) return;
    setLoadingPhoto(true);

    try {
      if (file) {
        await toast.promise(
          uploadProfilePhoto({ uuid: profileData.uuid, file }),
          {
            loading: "Uploading photo...",
            success: "Profile photo updated!",
            error: "Failed to upload photo",
          },
        );
      } else {
        await toast.promise(
          uploadProfilePhoto({
            uuid: profileData.uuid,
            file: new File([], ""),
          }),
          {
            loading: "Removing photo...",
            success: "Profile photo removed!",
            error: "Failed to remove photo",
          },
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

    const isMobile = useIsMobile()
  

  return (
    <>
      <PageMeta title="Show Users" />
      <PageBreadcrumb pageTitle="Profile" hideItem = {true}
        crumbs={[{ name: "Home", href: "/" }, { name: "Profile" }]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        {isFetchingUser ? (
          <ShowUsersSkeleton isMobile={isMobile} />
        ) : (
          <div className="space-y-6">
            <ProfileContent
              user={profileData}
              onChangePhoto={handleOpenPhotoModal}
              isMobile={isMobile}
            />

            <EditProfilePhotoModal
              isOpen={isPhotoModalOpen}
              onClose={() => setPhotoModalOpen(false)}
              currentPhoto={profileData?.employee?.profile_photo}
              onUpload={handleUploadPhoto}
              isLoading={loadingPhoto}
            />
          </div>
        )}
      </div>
    </>
  );
}
