import { Helmet, HelmetProvider } from "react-helmet-async";
import React from "react";

interface PageMetaProps {
  title: string;
  description?: string;
}

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Helmet prioritizeSeoTags>
      <title>{title} | Admin Panel</title>
      {description && (
        <meta name="description" content={description} />
      )}
    </Helmet>
  );
}
