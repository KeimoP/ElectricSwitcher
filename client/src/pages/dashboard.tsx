import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ElectricityPlan, PlanSwitch } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/me"],
  });

  const { data: plans } = useQuery<ElectricityPlan[]>({
    queryKey: ["/api/plans"],
  });

  const { data: switches } = useQuery<PlanSwitch[]>({
    queryKey: ["/api/switches"],
  });

  const handleSwitch = async (planId: number) => {
    try {
      await fetch("/api/switches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPlanId: user?.currentProvider ? 1 : 0,
          toPlanId: planId,
        }),
        credentials: "include",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/switches"] });
      toast({
        title: "Success",
        description: "Plan switch request submitted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: "Failed to request plan switch",
      });
    }
  };

  if (!user || !plans) {
    return <div className="container py-8">{t("loading")}</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t("dashboard.title")}</h1>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t("dashboard.current_plan")}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium">{user.currentProvider || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per kWh</p>
              <p className="font-medium">{user.currentPrice || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="space-y-2 mb-4">
                <p>Provider: {plan.provider}</p>
                <p>Price: {plan.pricePerKwh}€/kWh</p>
                <p>Fixed fee: {plan.fixedFee}€/month</p>
                <p>Contract: {plan.contractLength} months</p>
              </div>
              <Button
                onClick={() => handleSwitch(plan.id)}
                className="w-full"
              >
                Switch to this plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Switch History */}
      {switches && switches.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t("dashboard.switches")}</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {switches.map((s) => (
                <div key={s.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Plan switch #{s.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(s.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="capitalize">{s.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
