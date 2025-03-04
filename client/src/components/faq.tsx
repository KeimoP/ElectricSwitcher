import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  { key: "q1", a: "a1" },
  { 
    key: "q2",
    a: "Meie teenus aitab teil automaatselt leida ja vahetada soodsaima elektripaketi. Jälgime pidevalt turul olevaid pakkumisi."
  },
  {
    key: "q3",
    a: "Elektripaketi vahetus võtab tavaliselt aega 2-3 nädalat. Meie hoolitseme kogu protsessi eest."
  },
  {
    key: "q4",
    a: "Jah, võite igal ajal oma paketti vahetada. Arvestage, et mõnel pakkujal võivad olla lepingu lõpetamise tasud."
  }
];

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("faq.title")}
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">
              {t(`faq.${item.key}`)}
            </AccordionTrigger>
            <AccordionContent>
              {t(`faq.${item.a}`) || item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
