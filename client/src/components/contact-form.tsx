import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export default function ContactForm() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    // Mock form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Success",
      description: "Your message has been sent. We'll get back to you soon.",
    });
    
    form.reset();
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("contact.title")}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.email")}</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.message")}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t("contact.send")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
