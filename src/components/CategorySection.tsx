import React from 'react';
import { Grid, Typography, Snackbar, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UmrahPackage } from '@/services/package'
import PlanCard from './PlanCard';

type Category = {
  id: string;
  title: string;
  description: string;
  icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => JSX.Element;
};


type CategorySectionProps = {
  category: Category;
  packages: UmrahPackage[];
};

const CategorySection: React.FC<CategorySectionProps> = ({ category, packages }) => {
  const router = useRouter();

  return (
    <>
      {/* Category Header */}
      {packages.length > 0 && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center">
              <div className="h-px w-8 bg-gray-300"></div>
              {category.icon({ className: "w-6 h-6 mx-3 text-[#811745]" })}
              <div className="h-px w-8 bg-gray-300"></div>
            </div>
            <h3 className="text-xl font-bold text-[#811745] mt-2">{category.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>
        </Grid>
      )}

      {/* Packages Grid */}
      {packages.map((plan) => (
        <PlanCard plan={plan}/>
      ))}
    </>
  );
};

export default CategorySection;
