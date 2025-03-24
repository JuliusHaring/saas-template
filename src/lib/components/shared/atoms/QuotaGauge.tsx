import {
  Quota,
  QuotasTierLimits,
} from "@/lib/services/api-services/quotas-service";
import { SubscriptionTier, SubscriptionTierValues } from "@/lib/db/types";
import { GaugeComponent } from "react-gauge-component";

interface QuotaGaugeProps extends React.InputHTMLAttributes<HTMLInputElement> {
  subscriptionTier: SubscriptionTier;
  quotasTierLimits: QuotasTierLimits;
}

const QuotaGauge: React.FC<QuotaGaugeProps> = ({
  subscriptionTier,
  quotasTierLimits,
}) => {
  const tierIndex = SubscriptionTierValues.indexOf(subscriptionTier);
  const maxValue = Math.max(...quotasTierLimits.limits.map((qTL) => qTL.limit));

  const createTitle = (quota: Quota) => {
    switch (quota) {
      case Quota.MAX_FILES:
        return "Dateien";
      case Quota.MAX_CHAT_MESSAGES:
        return "Nachrichten";
    }
  };

  return (
    <GaugeComponent
      type="semicircle"
      arc={{
        cornerRadius: 0,
        subArcs: quotasTierLimits.limits.map((tl, i) => ({
          limit: tl.limit,
          color: i <= tierIndex ? "#14de09" : "#7d7d7d",
          tooltip: {
            text: tl.tier.toString(),
          },
          //   onClick: navigateToPricingTable,
        })),
      }}
      labels={{
        tickLabels: {
          type: "inner",
          ticks: quotasTierLimits.limits.map((qTL) => ({ value: qTL.limit })),
        },
        valueLabel: {
          style: {
            color: "black",
            fill: "unset",
            textShadow: "unset",
            fontSize: "50%",
          },
          formatTextValue: (val) =>
            val + " " + createTitle(quotasTierLimits.quota),
        },
      }}
      value={quotasTierLimits.usage}
      maxValue={maxValue}
      minValue={0}
      pointer={{
        type: "arrow",
      }}
    />
  );
};

export default QuotaGauge;
