import { useEffect, useState } from "react";
import QuotaGauge from "../atoms/QuotaGauge";
import { QuotasTierLimitsInfo } from "@/lib/api-services/quotas-service";
import Card from "./Card";
import { FEQutoaService } from "@/lib/frontend-services/quota-service";

const feQuotaService = FEQutoaService.Insance;

const QuotasOverview: React.FC = () => {
  const [tierQuotaLimitsInfo, setTierQuotaLimitsInfo] =
    useState<QuotasTierLimitsInfo>();

  useEffect(() => {
    const queryTierQuotaLimits = async () => {
      const qtli: QuotasTierLimitsInfo =
        await feQuotaService.getTierQuotaLimits();

      qtli.quotasTierLimits[0].limits[1].limit = 200;
      qtli.quotasTierLimits[0].limits[2].limit = 300;

      qtli.quotasTierLimits[1].limits[1].limit = 200;
      qtli.quotasTierLimits[1].limits[2].limit = 300;

      setTierQuotaLimitsInfo(qtli);
    };
    queryTierQuotaLimits();
  }, []);

  if (!tierQuotaLimitsInfo?.userTier || !tierQuotaLimitsInfo.quotasTierLimits)
    return <></>;

  return (
    <Card
      className="mb-4"
      header={<h1 className="font-semibold">Nutzungslimits</h1>}
    >
      <div className="grid sm:grid-cols-1 md:grid-cols-2">
        {tierQuotaLimitsInfo.quotasTierLimits.map((qTL, i) => {
          return (
            <QuotaGauge
              key={i}
              subscriptionTier={tierQuotaLimitsInfo!.userTier}
              quotasTierLimits={qTL}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default QuotasOverview;
