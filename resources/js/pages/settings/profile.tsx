import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayoutWrapper from '@/layouts/settings/settings-layout-wrapper';
import { useTranslation } from 'react-i18next';

type ProfileForm = {
    name: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('settings.profile.breadcrumbs'), href: '/settings/profile' }];

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayoutWrapper breadcrumbs={breadcrumbs}>
            <Head title={t('settings.profile.headTitle')} />

            <div className="space-y-6">
                <HeadingSmall title={t('settings.profile.headingTitle')} description={t('settings.profile.headingDesc')} />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('settings.profile.name')}</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder={t('settings.profile.namePlaceholder')}
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('settings.profile.email')}</Label>

                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder={t('settings.profile.emailPlaceholder')}
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{t('settings.profile.save')}</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">{t('settings.profile.saved')}</p>
                        </Transition>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </SettingsLayoutWrapper>
    );
}
