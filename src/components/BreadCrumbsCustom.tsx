import React from 'react';
import { ChevronRight } from 'lucide-react';

type BreadcrumbProps = {
  packageType: string;
  subType: string | null;
};

const BreadCrumbCustom: React.FC<BreadcrumbProps> = ({ packageType, subType }) => {
  // Use the first word from packageType as the base category.
  const baseCategory = packageType.split(" ")[0];
  const baseCategorySlug = baseCategory.toLowerCase();

  // Create the package link. For example, "Umrah Reguler" becomes "/umrah/reguler"
  const packageLink = "/" + packageType.toLowerCase().split(" ").join("/");

  let subTypeSlugParts: string[] = [];
  if (subType) {
    subTypeSlugParts = subType.toLowerCase().split(" ");
    if (subTypeSlugParts[0] === baseCategorySlug) {
      subTypeSlugParts.shift();
    }
  }

  const subTypeSlug = subTypeSlugParts.join("");
  const subTypeLink = packageLink + (subTypeSlug ? "/" + subTypeSlug : "");

  return (
    <div className="self-start flex items-center gap-2 text-sm mb-4">
      {/* Base category text */}
      <span className="text-[#811745] hover:underline">{baseCategory}</span>
      <ChevronRight className="w-4 h-4" />
      {/* Package type link */}
      <a href={packageLink} className="text-gray-600">
        {packageType}
      </a>
      {subType && (
        <>
          <ChevronRight className="w-4 h-4" />
          <a href={subTypeLink} className="text-gray-600">
            {subType}
          </a>
        </>
      )}
    </div>
  );
};

export default BreadCrumbCustom;
