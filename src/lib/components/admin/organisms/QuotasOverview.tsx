import { useEffect, useState } from "react";

import Link from "next/link";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import { QuotaUsageType } from "@/lib/services/api-services/quotas-service";
import { FEQutoaService } from "@/lib/services/frontend-services/quota-service";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import Banner from "@/lib/components/admin/molecules/Banner";
import Card from "@/lib/components/admin/organisms/Card";

const feQuotaService = FEQutoaService.Insance;

const QuotasOverview: React.FC = () => {
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsageType>();

  useEffect(() => {
    const queryTierQuotaLimits = async () => {
      // const qtli: QuotasTierLimitsInfo =
      //   await feQuotaService.getTierQuotaLimits();
      const quotaUsage = await feQuotaService.getQuotas();

      // setTierQuotaLimitsInfo(qtli);
      setQuotaUsage(quotaUsage);
    };
    queryTierQuotaLimits();
  }, []);

  if (!quotaUsage) return <LoadingSpinner />;

  function getResetDateString() {
    const resetDate = new Date(quotaUsage!.lastResetAt);
    resetDate.setMonth(resetDate.getMonth() + 1);
    return resetDate.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
    });
  }

  return (
    <div>
      <QuotaWarning quotaUsage={quotaUsage} />
      <Card header={"Nutzungslimits (bis " + getResetDateString() + ")"}>
        <div className="grid sm:grid-cols-1 md:grid-cols-2">
          {/* {tierQuotaLimitsInfo.quotasTierLimits.map((qTL, i) => {
              return (
                <QuotaGauge
                  key={i}
                  subscriptionTier={tierQuotaLimitsInfo!.userTier}
                  quotasTierLimits={qTL}
                />
              );
            })} */}

          <p>
            Nachrichten:{" "}
            <span className="font-bold">{quotaUsage?.chatMessages.used}</span> /{" "}
            {quotaUsage?.chatMessages.limit}
          </p>
          <p>
            Dateien:{" "}
            <span className="font-bold">{quotaUsage?.fileCount.used}</span> /{" "}
            {quotaUsage?.fileCount.limit}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default QuotasOverview;

interface QuotaWarningProps {
  quotaUsage: QuotaUsageType;
}

const QuotaWarning: React.FC<QuotaWarningProps> = ({ quotaUsage }) => {
  if (
    !!quotaUsage &&
    Object.values(quotaUsage as Omit<QuotaUsageType, "lastResetAt">).some(
      (usage) => usage.reached,
    )
  ) {
    return (
      <div className="my-2">
        <Banner variant="danger">
          Sie haben ein Nutzungslimit erreicht. Erwägen Sie ein{" "}
          <Link
            href={``}
            className="hover:font-normal"
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
