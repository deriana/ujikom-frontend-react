import GridShape from "@/components/common/GridShape";
import useGoBack from "@/hooks/useGoBack";
import Button from "../ui/button/Button";
import { useSettingsContext } from "@/context/SettingsContext";

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
  lightImage: string;
  darkImage: string;
}

export default function ErrorPage({
  code,
  title,
  message,
  lightImage,
  darkImage,
}: ErrorPageProps) {
  const goBack = useGoBack();

  const { general } = useSettingsContext();
  const footer =
    general?.footer || "Copyright 2026 © HideriHR. All rights reserved.";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
        <h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          {code}
        </h1>

        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">{title}</p>

        <img src={lightImage} alt={title} className="dark:hidden mx-auto" />
        <img
          src={darkImage}
          alt={title}
          className="hidden dark:block mx-auto"
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          {message}
        </p>

        <Button
          onClick={goBack}
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Back to Home Page
        </Button>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        {footer}
      </p>
    </div>
  );
}
