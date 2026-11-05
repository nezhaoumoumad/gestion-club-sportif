import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function UserDetails({ auth, client }) {
    const params = new URLSearchParams(window.location.search);
    const tabRetour = params.get('tab') || 'actif';

    const hasActiveSub = client.abonnements?.some(a => {
        return a.statut === 'actif' && new Date(a.date_fin) >= new Date();
    });
    const displayStatut = (client.statut === 'actif' && hasActiveSub) ? 'actif' : 'inactif';

    const priorite = { 'confirmee': 1, 'en_attente': 2, 'terminee': 3, 'annulee': 4 };

    const sortedReservations = [...(client.reservations || [])].sort((a, b) => {
        return (priorite[a.statut] || 5) - (priorite[b.statut] || 5);
    });

    const sortedCoachings = [...(client.reservations_coaching || [])].sort((a, b) => {
        return (priorite[a.statut] || 5) - (priorite[b.statut] || 5);
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${client.prenom} ${client.nom}`} />
            <div style={{ padding: '60px 40px', background: '#faf9f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    {/* HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontSize: '9px', letterSpacing: '4px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '800' }}>Fiche Client</p>
                            <h1 style={{ fontSize: '36px', fontWeight: '200', color: '#111' }}>{client.prenom} {client.nom}</h1>
                        </div>
                        <Link
                            href={route('admin.users') + '?tab=' + tabRetour}
                            style={{ fontSize: '10px', letterSpacing: '2px', color: '#c9a84c', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase' }}
                        >
                            ← Retour
                        </Link>
                    </div>

                    {/* INFOS PERSONNELLES */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '10px', letterSpacing: '3px', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '800' }}>Informations personnelles</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'start' }}>
                            <div>
                                <p style={{ fontSize: '9px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Email</p>
                                <p style={{ fontSize: '14px', color: '#333', wordBreak: 'break-all' }}>{client.email}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '9px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Téléphone</p>
                                <p style={{ fontSize: '14px', color: '#333' }}>{client.telephone || '—'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '9px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Statut du compte</p>
                                <p style={{
                                    fontSize: '14px',
                                    color: displayStatut === 'actif' ? '#27ae60' : '#e74c3c',
                                    fontWeight: '700',
                                    textTransform: 'uppercase'
                                }}>
                                    {displayStatut}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PAIEMENTS */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '10px', letterSpacing: '3px', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '800' }}>Paiements</h3>
                        {!client.paiements || client.paiements.length === 0 ? (
                            <p style={{ color: '#ccc', fontStyle: 'italic' }}>Aucun paiement enregistré.</p>
                        ) : client.paiements.map(p => {
                            // CORRECTION : on utilise abonnement_date_fin injecté par le controller
                            const estExpire = p.abonnement_date_fin
                                ? new Date(p.abonnement_date_fin) < new Date()
                                : false;

                            return (
                                <div key={p.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f5f5f5',
                                    opacity: estExpire ? 0.4 : 1,
                                    filter: estExpire ? 'grayscale(80%)' : 'none',
                                }}>
                                    <span style={{ fontSize: '13px', color: '#888' }}>
                                        {new Date(p.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                                        {p.montant} DH
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        color: estExpire ? '#888' : '#27ae60',
                                        textTransform: 'uppercase',
                                        fontWeight: '700'
                                    }}>
                                        {estExpire ? 'INACTIF' : 'ACTIF'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* RÉSERVATIONS SÉANCES */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '10px', letterSpacing: '3px', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '800' }}>Réservations de séances</h3>
                        {sortedReservations.length === 0 ? (
                            <p style={{ color: '#ccc', fontStyle: 'italic' }}>Aucune réservation.</p>
                        ) : sortedReservations.map(r => {
                            const isPast = r.statut === 'annulee' || r.statut === 'terminee';
                            return (
                                <div key={r.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f5f5f5',
                                    opacity: isPast ? 0.4 : 1
                                }}>
                                    <span style={{ fontSize: '14px', color: isPast ? '#888' : '#333', fontWeight: isPast ? '400' : '600' }}>{r.seance?.sport?.nom}</span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>{r.seance?.date_heure ? new Date(r.seance.date_heure).toLocaleString('fr-FR') : '—'}</span>
                                    <span style={{
                                        fontSize: '11px',
                                        color: r.statut === 'confirmee' ? '#27ae60' : r.statut === 'en_attente' ? '#c9a84c' : '#888',
                                        textTransform: 'uppercase',
                                        fontWeight: '700'
                                    }}>
                                        {r.statut.replace('_', ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* SESSIONS COACHING */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '10px', letterSpacing: '3px', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '800' }}>Sessions Coaching</h3>
                        {sortedCoachings.length === 0 ? (
                            <p style={{ color: '#ccc', fontStyle: 'italic' }}>Aucune session coaching.</p>
                        ) : sortedCoachings.map(r => {
                            const isPast = r.statut === 'annulee' || r.statut === 'terminee';
                            return (
                                <div key={r.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f5f5f5',
                                    opacity: isPast ? 0.4 : 1
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: isPast ? '400' : '600' }}>
                                        Coach {r.profil_coach?.user?.prenom} {r.profil_coach?.user?.nom}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>{r.date_seance || '—'}</span>
                                    <span style={{
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        fontWeight: '700',
                                        color: r.statut === 'confirmee' ? '#27ae60' : r.statut === 'en_attente' ? '#c9a84c' : '#888'
                                    }}>
                                        {r.statut}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}