import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import { ProductDescriptionType } from "@/lib/services/api-services/stripe-service";
import { FEStripeService } from "@/lib/services/frontend-services/stripe-service";
import { useState, useEffect } from "react";
import Card from "@/lib/components/admin/organisms/Card";
import Button from "@/lib/components/admin/molecules/Button";

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
        <Card
          key={index}
          className="p-6 text-center shadow-lg h-full flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {product.priceEUR.toFixed(2)}€
            </p>
            <ul className="mt-4 text-gray-600 space-y-2 flex-grow">
              {product.marketingFeatures.map((feature, i) => (
                <li key={i} className="text-sm">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <Button href="/admin">
              {product.hasTestPhase ? "Testversion starten" : "Abonnieren"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
