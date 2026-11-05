import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PaiementsIndex({ paiements }) {
    const statusStyle = {
        effectue: { background: '#d4edda', color: '#155724' },
        echoue: { background: '#f8d7da', color: '#721c24' },
        rembourse: { background: '#e2e3e5', color: '#383d41' },
        en_attente: { background: '#fff3cd', color: '#856404' },
    };

    return (
        <AuthenticatedLayout header={<h2 style={{ fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#555' }}>Mes Paiements</h2>}>
            <Head title="Mes Paiements" />
            <div style={{ padding: '48px', background: '#f8f7f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px' }}>Historique</p>
                        <h1 style={{ fontSize: '36px', fontWeight: '300', color: '#111' }}>Mes Paiements</h1>
                    </div>
                    {paiements.length === 0 ? (
                        <div style={{ background: '#fff', padding: '80px', textAlign: 'center' }}>
                            <p style={{ color: '#999' }}>Aucun paiement enregistré.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {paiements.map((p) => (
                                <div key={p.id} style={{ background: '#fff', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '8px' }}>{p.abonnement?.formule?.nom}</h3>
                                        <p style={{ color: '#888', fontSize: '13px' }}>📅 {new Date(p.date_paiement).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <p style={{ fontSize: '28px', fontWeight: '200', color: '#111' }}>{p.montant} <span style={{ fontSize: '14px', color: '#aaa' }}>DH</span></p>
                                        <span style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '2px', ...statusStyle[p.statut] }}>
                                            {p.statut}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}