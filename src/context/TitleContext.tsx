import { createContext, useContext, useState, ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface TitleContextType {
  setTitle: (title: string, description?: string) => void;
}

const TitleContext = createContext<TitleContextType>({
  setTitle: () => {},
});

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState({ title: "Default", description: "Default description" });

  const setTitle = (title: string, description?: string) => {
    setMeta({ title, description: description || meta.description });
  };

  return (
    <TitleContext.Provider value={{ setTitle }}>
      <HelmetProvider>
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        {children}
      </HelmetProvider>
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);
