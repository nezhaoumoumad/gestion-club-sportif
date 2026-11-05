import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SeanceInscrits({ auth, seance }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Liste des inscrits" />
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <Link href={route('admin.seances.index')} style={{ color: '#C5A059', textDecoration: 'none', fontWeight: 'bold' }}>
                    ← Retour au planning
                </Link>

                <h1 style={{ marginTop: '20px' }}>Inscrits - {seance.sport?.nom}</h1>
                <p style={{ color: '#666' }}>Séance du {new Date(seance.date_heure).toLocaleString()}</p>

                <div style={{ marginTop: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f8f8' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Nom / Prénom</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Email</th>
                                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>Date d'inscription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seance.reservations && seance.reservations.length > 0 ? (
                                seance.reservations.map((res) => (
                                    <tr key={res.id}>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                                            {res.user ? `${res.user.prenom} ${res.user.nom}` : 'Utilisateur inconnu'}
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{res.user?.email}</td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                                            {new Date(res.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                        Aucun inscrit pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}