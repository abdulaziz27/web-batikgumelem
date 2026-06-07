import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';

type FaqItem = { question: string; answer: string };

const FAQ = () => {
    const { t } = useTranslation();
    const faqItems = t('faq.items', { returnObjects: true }) as FaqItem[];
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">{t('faq.title')}</h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            {t('faq.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <AccordionTrigger className="text-batik-brown hover:text-batik-indigo px-6 py-4 text-left font-medium">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-gray-600">{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-12 rounded-xl bg-white p-6 text-center shadow-sm">
                        <h2 className="text-batik-brown mb-4 text-xl font-semibold">{t('faq.moreQuestionsTitle')}</h2>
                        <p className="mb-6 text-gray-600">
                            {t('faq.moreQuestionsBody')}
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="mailto:info@batikgumelem.com"
                                className="bg-batik-brown hover-lift hover:bg-batik-brown/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white"
                            >
                                {t('faq.emailUs')}
                            </a>
                            <a
                                href="https://wa.me/6285944608542"
                                className="border-batik-brown text-batik-brown hover-lift hover:bg-batik-brown/10 inline-flex items-center justify-center rounded-lg border px-6 py-3"
                            >
                                {t('faq.whatsapp')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FAQ;
