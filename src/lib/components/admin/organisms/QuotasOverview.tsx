import { useEffect, useState } from "react";

import Link from "next/link";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import {
  QuotasTierLimitsInfo,
  QuotaUsageType,
} from "@/lib/services/api-services/quotas-service";
import { FEQutoaService } from "@/lib/services/frontend-services/quota-service";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import QuotaGauge from "@/lib/components/admin/atoms/QuotaGauge";
import Banner from "@/lib/components/admin/molecules/Banner";
import Card from "@/lib/components/admin/organisms/Card";

const feQuotaService = FEQutoaService.Insance;

const QuotasOverview: React.FC = () => {
  const [tierQuotaLimitsInfo, setTierQuotaLimitsInfo] =
    useState<QuotasTierLimitsInfo>();

  useEffect(() => {
    const queryTierQuotaLimits = async () => {
      const qtli: QuotasTierLimitsInfo =
        await feQuotaService.getTierQuotaLimits();

      if (qtli.quotasTierLimits) {
        qtli.quotasTierLimits[0].limits[1].limit = 200;
        qtli.quotasTierLimits[0].limits[2].limit = 300;

        qtli.quotasTierLimits[1].limits[1].limit = 200;
        qtli.quotasTierLimits[1].limits[2].limit = 300;
      }

      setTierQuotaLimitsInfo(qtli);
    };
    queryTierQuotaLimits();
  }, []);

  if (!tierQuotaLimitsInfo?.userTier || !tierQuotaLimitsInfo.quotasTierLimits)
    return <LoadingSpinner />;

  return (
    <div>
      <QuotaWarning tierQuotaLimitsInfo={tierQuotaLimitsInfo} />
      <div>
        <Card header={<h1 className="font-semibold">Nutzungslimits</h1>}>
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
      </div>
    </div>
  );
};

export default QuotasOverview;

interface QuotaWarningProps {
  tierQuotaLimitsInfo: QuotasTierLimitsInfo;
}

const QuotaWarning: React.FC<QuotaWarningProps> = ({ tierQuotaLimitsInfo }) => {
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsageType>();

  useEffect(() => {
    const queryQuotaUsage = async () => {
      const quotaUsage = await feQuotaService.getQuotas();
      setQuotaUsage(quotaUsage);
    };
    queryQuotaUsage();
  }, []);

  if (
    !!quotaUsage &&
    Object.values(quotaUsage).some((usage) => usage.reached)
  ) {
    return (
      <div className="mb-2">
        <Banner variant="danger">
          Sie haben ein Nutzungslimit für das Abo {tierQuotaLimitsInfo.userTier}{" "}
          erreicht. Erwägen Sie ein{" "}
          <Link
            href={``}
            className="font-semibold hover:font-normal"
            onClick={openBillingPortal}
          >
            Upgrade
          </Link>
          !
        </Banner>
      </div>
    );
  }
  return <></>;
};
