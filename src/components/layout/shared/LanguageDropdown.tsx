'use client'

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { Dropdown } from "./Dropdown";


import i18n from "@/configs/i18n";

import languages from "./languages";

const LanguageDropdown = ({setIsLoading} : {setIsLoading:any}) => {
  const [selectedLang, setSelectedLang] = useState("");

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") ?? "en";

    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  };

  return (
    <Dropdown className="relative flex items-center h-header">
      <Dropdown.Trigger
        type="button"
        className="inline-flex justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-200 ease-linear bg-topbar rounded-md dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover"
        id="flagsDropdown"
        data-bs-toggle="dropdown"
      >
        <Image
          src={languages[selectedLang as keyof typeof languages]?.flag || ""}
          alt="header-lang-img"
          width={20}
          height={20}
          className={`h-5 rounded-sm transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)} // Ensures it stops loading on error
        />
      </Dropdown.Trigger>
      <Dropdown.Content
        placement="top-start"
        className="absolute translate-x-[-100px] z-50 p-3 md:p-4 xl:p-5 ltr:text-left rtl:text-right bg-white rounded-md shadow-md
             !top-4 dropdown-menu min-w-[10rem] md:min-w-[12rem] xl:min-w-[14rem]
             flex flex-col gap-3 xl:gap-4 dark:bg-zink-600"
        aria-labelledby="flagsDropdown"
      >
        {Object.keys(languages).map((key) => (
          <a
            href=""
            className={`flex items-center gap-3 md:gap-4 xl:gap-4 group/items language
                  ${selectedLang === key ? "active" : "none"}
                  px-2 py-2 md:px-3 md:py-3 xl:px-3 xl:py-3 transition-all`}
            title={languages[key as keyof typeof languages]?.label || ""}
            onClick={() => changeLanguageAction(key)}
            key={key}
          >
            <Image
              src={languages[key as keyof typeof languages]?.flag || ""}
              alt=""
              width={20}
              height={20}
              className="shadow-sm object-cover w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 rounded-full"
            />
            <h6 className="transition-all duration-200 ease-linear font-medium text-slate-600
                     md:text-sm xl:text-base dark:text-zink-200
                     group-hover/items:text-custom-500">
              {languages[key as keyof typeof languages]?.label || ""}
            </h6>
          </a>
        ))}
      </Dropdown.Content>


    </Dropdown>
  );
};

export default LanguageDropdown;
