import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        prenom: user.prenom || '', // Adapté à ta colonne 'prenom'
        nom: user.nom || '',       // Adapté à ta colonne 'nom'
        email: user.email || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informations du profil</h2>
                <p className="mt-1 text-sm text-gray-600">Mettez à jour votre nom, prénom et adresse e-mail.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />
                    <TextInput id="prenom" className="mt-1 block w-full" value={data.prenom} onChange={(e) => setData('prenom', e.target.value)} required isFocused />
                    <InputError className="mt-2" message={errors.prenom} />
                </div>

                <div>
                    <InputLabel htmlFor="nom" value="Nom" />
                    <TextInput id="nom" className="mt-1 block w-full" value={data.nom} onChange={(e) => setData('nom', e.target.value)} required />
                    <InputError className="mt-2" message={errors.nom} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Enregistré.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}