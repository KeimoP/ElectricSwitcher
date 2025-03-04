import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ElectricityPlan } from "@shared/schema";

export default function SavingsCalculator() {
  const { t } = useTranslation();
  const [consumption, setConsumption] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [calculated, setCalculated] = useState(false);

  const { data: plans } = useQuery<ElectricityPlan[]>({
    queryKey: ["/api/plans"],
  });

  const calculateSavings = () => {
    setCalculated(true);
  };

  const getBestSavings = () => {
    if (!plans) return 0;

    const currentCost = consumption * currentPrice;
    const bestPlan = plans.reduce((best, plan) => {
      const planPricePerKwh = parseFloat(plan.pricePerKwh.toString());
      const planFixedFee = parseFloat(plan.fixedFee.toString());
      const cost = (consumption * planPricePerKwh) + planFixedFee;
      return cost < best.cost ? { plan, cost } : best;
    }, { plan: plans[0], cost: Number.POSITIVE_INFINITY });

    return Math.max(0, currentCost - bestPlan.cost);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">
          {t("calculator.title")}
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("calculator.consumption")}
            </label>
            <Input
              type="number"
              min="0"
              value={consumption}
              onChange={(e) => setConsumption(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("profile.current_price")}
            </label>
            <Input
              type="number"
              step="0.001"
              min="0"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
            />
          </div>

          <Button
            onClick={calculateSavings}
            className="w-full"
            disabled={!consumption || !currentPrice}
          >
            {t("calculator.calculate")}
          </Button>

          {calculated && (
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-primary">
                {getBestSavings().toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">
                Estimated monthly savings
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}