import { Helmet, HelmetProvider } from "react-helmet-async";
import React from "react";
import { useSettingsContext } from "@/context/SettingsContext";

interface PageMetaProps {
  title: string;
  description?: string;
}

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default function PageMeta({ title, description }: PageMetaProps) {
  const { general } = useSettingsContext();

  const faviconUrl = general?.favicon || "/placeholder_img.jpg";

  return (
    <Helmet prioritizeSeoTags defer={false}>
      <title>{`${title} | ${
        general?.site_name || "HRIS Management"
      }`}</title>
      {description && <meta name="description" content={description} />}

      <link rel="icon" href={faviconUrl} />
      <link rel="shortcut icon" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
    </Helmet>
  );
}
