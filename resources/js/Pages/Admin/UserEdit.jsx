import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function UserEdit({ auth, client }) {
    const { data, setData, patch, processing, errors } = useForm({
        prenom:    client.prenom || '',
        nom:       client.nom || '',
        email:     client.email || '',
        telephone: client.telephone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', client.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier — ${client.prenom} ${client.nom}`} />
            <div style={{ padding: '60px 40px', background: '#faf9f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontSize: '9px', letterSpacing: '4px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '800' }}>Modification</p>
                            <h1 style={{ fontSize: '32px', fontWeight: '200', color: '#111' }}>{client.prenom} {client.nom}</h1>
                        </div>
                        <Link href={route('admin.users')} style={{ fontSize: '10px', letterSpacing: '2px', color: '#c9a84c', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase' }}>← Retour</Link>
                    </div>

                    <div style={{ background: '#fff', padding: '40px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <form onSubmit={submit}>
                            {[
                                { field: 'prenom', label: 'Prénom', type: 'text' },
                                { field: 'nom', label: 'Nom', type: 'text' },
                                { field: 'email', label: 'Email', type: 'email' },
                                { field: 'telephone', label: 'Téléphone', type: 'text' },
                            ].map(({ field, label, type }) => (
                                <div key={field} style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '9px', letterSpacing: '2px', color: '#bbb', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '800' }}>{label}</label>
                                    <input
                                        type={type}
                                        value={data[field]}
                                        onChange={e => setData(field, e.target.value)}
                                        style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '10px 0', fontSize: '14px', background: 'transparent', outline: 'none', color: '#333', boxSizing: 'border-box' }}
                                    />
                                    {errors[field] && <p style={{ color: '#e74c3c', fontSize: '11px', marginTop: '4px' }}>{errors[field]}</p>}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={processing}
                                style={{ background: '#111', color: '#fff', padding: '14px 40px', border: 'none', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: '700', marginTop: '16px' }}
                            >
                                {processing ? '...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}