import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const History = () => {
    const { t } = useTranslation();
    const section1Paragraphs = t('history.section1Paragraphs', { returnObjects: true }) as string[];
    const section2Paragraphs = t('history.section2Paragraphs', { returnObjects: true }) as string[];
    const motifs = t('history.motifs', { returnObjects: true }) as {
        key: string;
        label: string;
        title: string;
        image: string;
        alt: string;
        paragraphs: string[];
    }[];
    const preservationCards = t('history.preservationCards', { returnObjects: true }) as {
        title: string;
        body: string;
        image: string;
        alt: string;
    }[];
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">
                            {t('history.titlePrefix')} <span className="text-batik-indigo">{t('history.titleBrand')}</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">{t('history.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold md:text-3xl">{t('history.section1Title')}</h2>
                        {section1Paragraphs.map((p, idx) => (
                            <p key={idx} className={idx === section1Paragraphs.length - 1 ? 'text-gray-600' : 'mb-4 text-gray-600'}>
                                {p}
                            </p>
                        ))}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative aspect-video w-full">
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                <iframe
                                    className="h-full w-full"
                                    src="https://www.youtube.com//embed/SbFw3iD63dw"
                                    title={t('history.videoTitle')}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <img
                                src="images/product_image_3.png"
                                alt={t('history.makingAlt')}
                                className="hero-image-shadow w-full rounded-xl shadow-lg"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold md:text-3xl">{t('history.section2Title')}</h2>
                        {section2Paragraphs.map((p, idx) => (
                            <p key={idx} className={idx === section2Paragraphs.length - 1 ? 'text-gray-600' : 'mb-4 text-gray-600'}>
                                {p}
                            </p>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown text-2xl font-bold md:text-3xl">{t('history.philosophyTitle')}</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                            {t('history.philosophySubtitle')}
                        </p>
                    </div>

                    <Tabs defaultValue="pring-sedapur" className="w-full">
                        <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-5">
                            {motifs.map((m) => (
                                <TabsTrigger key={m.key} value={m.key}>
                                    {m.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                            {motifs.map((m) => (
                                <TabsContent key={m.key} value={m.key}>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="aspect-square overflow-hidden">
                                            <img src={m.image} alt={m.alt} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-batik-indigo mb-4 text-xl font-bold">{m.title}</h3>
                                            {m.paragraphs.map((p, idx) => (
                                                <p key={idx} className={idx === m.paragraphs.length - 1 ? 'text-gray-600' : 'mb-4 text-gray-600'}>
                                                    {p}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="mb-12 text-center">
                        <h2 className="text-batik-brown text-2xl font-bold md:text-3xl">{t('history.preservationTitle')}</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                            {t('history.preservationSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {preservationCards.map((c, idx) => (
                            <div key={idx} className="hover-lift overflow-hidden rounded-xl bg-white shadow-sm">
                                <div className="aspect-video overflow-hidden">
                                    <img src={c.image} alt={c.alt} className="h-full w-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-batik-indigo mb-2 text-lg font-semibold">{c.title}</h3>
                                    <p className="text-gray-600">{c.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="/about"
                            className="bg-batik-brown hover-lift hover:bg-batik-brown/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white"
                        >
                            {t('history.ctaCommunity')}
                        </a>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default History;
