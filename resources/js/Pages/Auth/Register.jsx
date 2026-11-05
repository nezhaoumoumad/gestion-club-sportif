import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        password_confirmation: '',
        telephone: '',
    });

     const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="S'inscrire" />

            {/* <div className="flex items-center justify-center font-bold text-3xl tracking-wider my-6 uppercase">
                <span className="text-black">Elite</span>
                <span className="text-amber-500 ml-1">Sport</span>
            </div> */}

            <form onSubmit={submit}>

                {/* Prénom */}
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />
                    <TextInput
                        id="prenom"
                        name="prenom"
                        value={data.prenom}
                        className="mt-1 block w-full"
                        autoComplete="given-name"
                        onChange={(e) => setData('prenom', e.target.value)}
                        required
                    />
                    <InputError message={errors.prenom} className="mt-2" />
                </div>

                {/* Nom */}
                <div className="mt-4">
                    <InputLabel htmlFor="nom" value="Nom" />
                    <TextInput
                        id="nom"
                        name="nom"
                        value={data.nom}
                        className="mt-1 block w-full"
                        autoComplete="family-name"
                        onChange={(e) => setData('nom', e.target.value)}
                        required
                    />
                    <InputError message={errors.nom} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Téléphone */}
                <div className="mt-4">
                    <InputLabel htmlFor="telephone" value="Téléphone (optionnel)" />
                    <TextInput
                        id="telephone"
                        name="telephone"
                        value={data.telephone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('telephone', e.target.value)}
                    />
                    <InputError message={errors.telephone} className="mt-2" />
                </div>

                {/* Mot de passe */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirmation mot de passe */}
                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link href={route('login')} className="text-sm text-gray-600 underline">
                        Déjà inscrit ?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        S'inscrire
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
     );
}