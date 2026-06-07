import { Award, CircleDollarSign, HeartHandshake, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons = [Award, HeartHandshake, Leaf, ShieldCheck, Truck, CircleDollarSign] as const;

const WhyBuySection = () => {
    const { t } = useTranslation();
    const reasons = t('whyBuy.reasons', { returnObjects: true }) as { title: string; description: string }[];
    return (
        <section className="bg-batik-cream/40 batik-pattern py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-batik-brown text-3xl font-bold">
                        {t('whyBuy.titlePrefix')} <span className="text-batik-indigo">{t('whyBuy.titleBrand')}</span>?
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
                        {t('whyBuy.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="hover-lift animate-fade-in rounded-xl bg-white p-6 shadow-sm"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="mb-4 flex items-center">
                                <div className="bg-batik-brown/10 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    {(() => {
                                        const Icon = icons[index] ?? Award;
                                        return <Icon className="text-batik-brown h-6 w-6" />;
                                    })()}
                                </div>
                                <h3 className="text-batik-brown text-xl font-semibold">{reason.title}</h3>
                            </div>
                            <p className="text-gray-600">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyBuySection;
