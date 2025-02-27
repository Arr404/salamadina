import flagUs from "@/assets/images/flags/20/us.svg";
import flagIndo from "@/assets/images/flags/20/id.svg";


const languages: Record<"en" | "ind", { label: string; flag: any }> = {
  en: {
    label: "English",
    flag: flagUs,
  },
  ind: {
    label: "Indonesia",
    flag: flagIndo,
  },
};

export default languages
