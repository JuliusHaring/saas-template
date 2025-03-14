import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import { ProductDescriptionType } from "@/lib/services/api-services/stripe-service";
import { FEStripeService } from "@/lib/services/frontend-services/stripe-service";
import { useState, useEffect } from "react";
import Button from "@/lib/components/admin/molecules/Button";
import { CheckIcon } from "@heroicons/react/24/outline";

const feStripeService = FEStripeService.Instance;

export const Pricing: React.FC = () => {
  const [productDescriptions, setProductDescriptions] =
    useState<ProductDescriptionType[]>();

  useEffect(() => {
    const getProductDescriptions = async () => {
      const descriptions = await feStripeService.getProductDescriptions();
      setProductDescriptions(descriptions);
    };
    getProductDescriptions();
  }, []);

  if (!productDescriptions) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {productDescriptions.map((product, index) => (
        <div
          key={index}
          className={`p-6 h-full flex flex-col justify-between relative ${product.isHighlighted ? 'bg-gray-100 border border-gray-300' : ''}`}
        >
          {product.isHighlighted && (
            <div className="absolute top-2 left-2 bg-gray-300 text-gray-800 text-xs font-semibold px-3 py-1 rounded">
              Am beliebtesten
            </div>
          )}
          <div className="flex flex-col flex-grow justify-center mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {product.priceEUR.toFixed(2)}€
            </p>
            <ul className="mt-4 text-gray-600 space-y-2 flex-grow">
              {product.marketingFeatures.map((feature, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <CheckIcon className="h-3 w-3 text-blue-600" /> {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 text-center">
            <Button href="/admin">
              {product.hasTestPhase ? "Testversion starten" : "Abonnieren"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
