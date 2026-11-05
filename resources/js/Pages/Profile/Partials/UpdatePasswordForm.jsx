import { useRef, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const user = usePage().props.auth.user;

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // LE COMPROMIS : On vide le state au chargement
    // Cela laisse le champ vide pour l'utilisateur, 
    // mais garde les bons attributs pour le navigateur.
    useEffect(() => {
        setData('current_password', '');
    }, []);

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Modifier le mot de passe</h2>
                <p className="mt-1 text-sm text-gray-600">Sécurisez votre compte.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* 1. ON GARDE L'EMAIL VISIBLE POUR LE NAVIGATEUR (Essentiel pour la popup) */}
                <input 
                    type="text" 
                    name="username" 
                    autoComplete="username" 
                    value={user.email} 
                    readOnly
                    style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} 
                />

                <div>
                    <InputLabel htmlFor="current_password" value="Mot de passe actuel" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        /* ON REPASSE EN "current-password" pour que le navigateur 
                           comprenne qu'il doit proposer la mise à jour */
                        autoComplete="current-password" 
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
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