import { TierQuotasLimitsInfo } from "@/lib/api-services/quotas-service";
import { useEffect, useState } from "react";
import { GaugeComponent } from "react-gauge-component";

const QuotasOverview: React.FC = () => {
  const [tierQuotaLimitsInfo, setTierQuotaLimitsInfo] =
    useState<TierQuotasLimitsInfo>();

  useEffect(() => {
    const queryTierQuotaLimits = async () => {
      const res = await fetch("/api/quotas/info");
      const tQLI = await res.json();

      setTierQuotaLimitsInfo(tQLI);
    };
    queryTierQuotaLimits();
  });

  return (
    <GaugeComponent
      type="semicircle"
      arc={{
        nbSubArcs: 3,
        colorArray: ["#5BE12C", "#F5CD19", "#EA4228"],
        width: 0.3,
        padding: 0.003,
      }}
      labels={{
        valueLabel: {
          style: { fontSize: 40 },
          formatTextValue: (val) => val,
        },
        tickLabels: {
          type: "outer",
          ticks: [{ value: 20 }, { value: 50 }, { value: 100 }],
          defaultTickValueConfig: {
            formatTextValue: (val) => val,
          },
        },
      }}
      pointer={{ type: "arrow" }}
      value={20}
      maxValue={100}
    />
  );
};

export default QuotasOverview;
