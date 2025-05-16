"use client";

import { useEffect, useState } from "react";

import "@/app/globals.css";
import "@assets/iconify-icons/generated-icons.css";

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const updateLanguage = () => {
      const currentLang = localStorage.getItem("I18N_LANGUAGE") || "en";

      setLanguage(currentLang);
    };

    // Set initial language and direction
    updateLanguage();

    // Listen for localStorage changes
    window.addEventListener("storage", updateLanguage);

    return () => {
      window.removeEventListener("storage", updateLanguage);
    };
  }, []);

  return (
    <html id="__next" lang={language} dir={'ltr'} >
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Salamadina</title>
    </head>
    <body className="overflow-x-hidden flex is-full min-bs-full flex-auto flex-col">
    {children}
    </body>
    </html>
  );
};

export default RootLayout;
