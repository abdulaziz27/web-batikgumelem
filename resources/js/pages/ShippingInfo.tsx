import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Shipping = () => {
    const { t } = useTranslation();
    return (
        <Layout>
            <div className="bg-batik-cream/30 batik-pattern py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-batik-brown text-3xl font-bold tracking-tight sm:text-4xl">{t('shipping.title')}</h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
                            {t('shipping.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Shipping Information */}
                    <div className="animate-fade-in">
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold">{t('shipping.shippingInfoTitle')}</h2>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.methodsTitle')}</h3>
                                <p className="mb-4 text-gray-600">
                                    {t('shipping.methodsBody')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">JNE</p>
                                            <p className="text-sm text-gray-500">Regular (2-3 hari), YES (1 hari)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">SiCepat</p>
                                            <p className="text-sm text-gray-500">Regular (2-3 hari), BEST (1 hari)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">AnterAja</p>
                                            <p className="text-sm text-gray-500">Standard (2-3 hari), Same Day (dalam kota)</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Truck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-medium">Pos Indonesia</p>
                                            <p className="text-sm text-gray-500">Standard (3-7 hari)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.costTitle')}</h3>
                                <p className="text-gray-600">
                                    {t('shipping.costBody1')}
                                </p>
                                <p className="mt-3 text-gray-600">
                                    {t('shipping.costBody2')}
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.trackingTitle')}</h3>
                                <p className="text-gray-600">
                                    {t('shipping.trackingBody1')}
                                </p>
                                <p className="mt-3 text-gray-600">
                                    {t('shipping.trackingBody2')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Returns Information */}
                    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-batik-brown mb-6 text-2xl font-bold">{t('shipping.returnsTitle')}</h2>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.returnRequirementsTitle')}</h3>
                                <p className="mb-4 text-gray-600">{t('shipping.returnRequirementsIntro')}</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Clock className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">{t('shipping.returnReq1')}</p>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <Package className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">{t('shipping.returnReq2')}</p>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-batik-indigo/10 mt-1 mr-3 flex-shrink-0 rounded p-1">
                                            <ShieldCheck className="text-batik-indigo h-4 w-4" />
                                        </span>
                                        <p className="text-gray-600">{t('shipping.returnReq3')}</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.returnProcessTitle')}</h3>
                                <p className="mb-4 text-gray-600">{t('shipping.returnProcessIntro')}</p>
                                <ol className="list-decimal space-y-3 pl-5">
                                    <li className="text-gray-600">
                                        Hubungi Customer Service kami melalui email <span className="text-batik-indigo">admin@batikgumelem.com</span>{' '}
                                        atau WhatsApp <span className="text-batik-indigo">+62 859-4460-8542</span> untuk mengajukan pengembalian.
                                    </li>
                                    <li className="text-gray-600">Sertakan nomor pesanan, foto produk, dan alasan pengembalian.</li>
                                    <li className="text-gray-600">
                                        Setelah pengajuan disetujui, kirimkan produk kembali ke alamat yang kami berikan.
                                    </li>
                                    <li className="text-gray-600">
                                        Setelah produk diterima dan diperiksa, kami akan memproses pengembalian dana atau penggantian produk sesuai
                                        permintaan Anda.
                                    </li>
                                </ol>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h3 className="text-batik-indigo mb-4 text-lg font-semibold">{t('shipping.refundTitle')}</h3>
                                <p className="text-gray-600">
                                    {t('shipping.refundBody1')}
                                </p>
                                <p className="mt-3 text-gray-600">
                                    {t('shipping.refundBody2')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Features */}
                <div className="animate-fade-in mt-16" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-batik-brown mb-8 text-center text-2xl font-bold">{t('shipping.serviceTitle')}</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Truck className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{t('shipping.serviceNationalTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    {t('shipping.serviceNationalBody')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <ShieldCheck className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{t('shipping.serviceSecureTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    {t('shipping.serviceSecureBody')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Clock className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{t('shipping.serviceFastTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    {t('shipping.serviceFastBody')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader className="pb-2">
                                <div className="bg-batik-indigo/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <RotateCcw className="text-batik-indigo h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{t('shipping.serviceEasyReturnTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{t('shipping.serviceEasyReturnBody')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Shipping;
