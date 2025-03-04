import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SavingsCalculator from "@/components/savings-calculator";
import FAQ from "@/components/faq";
import ContactForm from "@/components/contact-form";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t("home.title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t("home.subtitle")}
              </p>
              <Link href="/auth">
                <Button size="lg" className="w-full md:w-auto">
                  {t("login.smartid")}
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1558368718-808f08b6d9a8"
                alt="Modern electricity"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.how_it_works")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t("home.step1"), img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
              { title: t("home.step2"), img: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51" },
              { title: t("home.step3"), img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <img 
                  src={step.img}
                  alt={step.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <SavingsCalculator />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto max-w-4xl px-4">
          <FAQ />
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
