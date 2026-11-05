import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    width: '100%' 
                }}>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile
                    </h2>

                    {/* Bouton retour inséré à l'endroit marqué */}
                    <Link 
                        href={route('dashboard')} 
                        style={{ 
                            fontFamily: "'Georgia', serif",
                            color: '#c9a84c', 
                            fontSize: '12px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '3px', 
                            textDecoration: 'none', 
                            fontWeight: 'bold', 
                            borderBottom: '1px solid #c9a84c',
                            paddingBottom: '2px'
                        }}
                    >
                        ← RETOUR
                    </Link>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}