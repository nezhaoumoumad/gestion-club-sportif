import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // Fond gris clair comme sur ta capture d'écran
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f3f4f6]">
            <Head title="Log in" />

            {/* Le rectangle blanc (Card) */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
                
                {/* Ton Titre ELITESPORT à la place du logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-black tracking-widest uppercase text-black">
                        ELITE<span className="text-[#c9a84c]">SPORT</span>
                    </Link>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        {/* Le bouton noir LOG IN */}
                        <PrimaryButton className="bg-[#1f2937]" disabled={processing}>
                            LOG IN
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}