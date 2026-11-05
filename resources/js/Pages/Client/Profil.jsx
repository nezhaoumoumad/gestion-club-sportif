import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ClientProfil({ user }) {
    return (
        <AuthenticatedLayout header={<h2 style={{ fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#555' }}>Mon Profil</h2>}>
            <Head title="Mon Profil" />
            <div style={{ padding: '48px', background: '#f8f7f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px' }}>Profil</p>
                        <h1 style={{ fontSize: '40px', fontWeight: '300', color: '#111' }}>{user.prenom} {user.nom}</h1>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

                        {/* INFOS */}
                        <div style={{ background: '#fff', padding: '40px' }}>
                            <h3 style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '24px' }}>Informations</h3>
                            {[
                                { label: 'Prénom', value: user.prenom },
                                { label: 'Nom', value: user.nom },
                                { label: 'Email', value: user.email },
                                { label: 'Téléphone', value: user.telephone || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                    <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>{label}</p>
                                    <p style={{ fontSize: '16px', color: '#111' }}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* ABONNEMENTS */}
                        <div style={{ background: '#fff', padding: '40px' }}>
                            <h3 style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '24px' }}>Abonnements</h3>
                            {user.abonnements?.length === 0 ? (
                                <div>
                                    <p style={{ color: '#bbb', marginBottom: '16px' }}>Aucun abonnement.</p>
                                    <Link href="/formules" style={{ color: '#c9a84c', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>Voir les formules →</Link>
                                </div>
                            ) : (
                                user.abonnements?.map((a) => (
                                    <div key={a.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                        <p style={{ fontWeight: '500', marginBottom: '4px' }}>{a.formule?.nom}</p>
                                        <p style={{ color: '#888', fontSize: '13px' }}>{a.formule?.prix} DH · {a.statut}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}