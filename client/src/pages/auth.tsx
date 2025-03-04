import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const smartIdSchema = z.object({
  personalCode: z.string().length(11),
});

export default function Auth() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof smartIdSchema>>({
    resolver: zodResolver(smartIdSchema),
    defaultValues: {
      personalCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof smartIdSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/smart-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast({
        title: "Success",
        description: "Successfully authenticated with Smart ID",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error instanceof Error ? error.message : "Authentication failed",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">{t("login.smartid")}</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="personalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.personal_code")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("loading") : t("login")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
