// components/PlanCard.tsx

import React, { useState,useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";
import { UmrahPackage } from '@/services/package'
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { isLogin } from '@/services/auth'
import LoadingWrapper from '@views/loading'


interface PlanCardProps {
  plan: UmrahPackage;
}

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

function getPackageUrl(packageType:string | undefined, id:string | undefined) {

  // Split the string by spaces and get the first word, then convert to lowercase.
  const firstWord = packageType?.trim().split(' ')[0];
  return `/${firstWord?.toLowerCase()}/package-detail?id=${id}`;
}

// Helper function to render tags
const renderTag = (tag: string, isPrimary = false) => (
  <span
    className={`text-xs px-2 py-1 rounded-full ${
      isPrimary
        ? 'bg-rose-100 text-rose-800'
        : 'bg-blue-100 text-blue-800'
    }`}
  >
      {tag}
    </span>
)

const PlanCard = ({ plan }: {plan:UmrahPackage}) => {
  const router = useRouter();
  const [dictionary, setDictionary] = useState<any>(null);

  const getLanguage = (): 'en' | 'ind' => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('I18N_LANGUAGE') as string | null;
      return lang === 'en' || lang === 'ind' ? lang : 'en'; // Default to 'en'
    }
    return 'en';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = getLanguage();
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = () => {
    router.push(getPackageUrl(plan.packageType, plan.id));
  };
  const isLoading =  !dictionary;

  const renderContent = () => (
    <Grid item xs={12} md={6} lg={4} key={plan.id}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105">
        {/* Card Image */}
        <div className="relative aspect-[3/2] bg-gray-200">
          <img
            className="h-full w-full object-contain"
            src={plan.imageUrl || "/images/gallery/placeholder.jpg"}
            alt="package"
          />
        </div>
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {plan.packageType && renderTag(plan.packageType, true)}
            {plan.subType && renderTag(plan.subType)}
            {plan.tags
              ?.filter(
                (tag) => tag !== plan.packageType && tag !== plan.subType
              )
              .map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>
          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2">
            {plan.title}
          </h3>
          <p className="text-gray-500 text-center italic mb-4">
            {plan.subtitle}
          </p>
          {/* Price */}
          <p className="text-2xl font-bold text-center text-rose-800 mb-6">
            {formatPrice(plan.price)}
          </p>
          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />
          {/* Features */}
          <div className="space-y-3">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {feature.icon === "" ? (
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${
                      idx < 3
                        ? "bg-blue-500"
                        : idx < 6
                          ? "bg-green-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    ✓
                  </span>
                ) : (
                  <i className={`tabler-${feature.icon} text-blue-600 text-lg`} />
                )}
                <span className="text-gray-600">{feature.label}</span>
              </div>
            ))}
          </div>
          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />
          {/* Seats */}
          <div className="mb-6">
            <p className="font-bold mb-2">{plan.seatsLeft} seats left!</p>
            <div className="h-2 bg-rose-100 rounded-full">
              <div
                className="h-full bg-rose-800 rounded-full"
                style={{
                  width: `${(plan.seatsLeft / plan.totalSeats) * 100}%`,
                }}
              />
            </div>
          </div>
          {/* Button */}
          <button
            className="w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            onClick={handleDetailClick}
          >
            <i className="tabler-user-search" />
            {dictionary['package']?.detail || 'Detail Package'}
          </button>
        </div>
      </div>
    </Grid>
  );

  return isLoading ? <LoadingWrapper /> : renderContent();
};

export default PlanCard;
