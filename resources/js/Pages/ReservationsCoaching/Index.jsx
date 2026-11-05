import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

const EliteHeader = ({ backLabel }) => (
    <nav style={{ padding: '30px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfbf9', borderBottom: '1px solid #f0f0f0' }}>
        <Link href="/" style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '5px', color: '#111', textDecoration: 'none' }}>
            ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
        </Link>
        <Link href={route('dashboard')} style={{ color: '#c9a84c', fontSize: '12px', letterSpacing: '3px', textDecoration: 'none', fontWeight: '600', textTransform: 'uppercase' }}>
            {backLabel}
        </Link>
    </nav>
);

export default function Index({ reservations = [], prixAbo = 0, utilisees = 0 }) {
    console.log('=== DEBUG RESERVATIONS ===', reservations);
    console.log('=== UTILISEES ===', utilisees);

    const { __, isRTL } = useTranslation();

    const aUnAbonnement = prixAbo > 0;
    const estBasique    = aUnAbonnement && prixAbo <= 110;
    const estMedium     = prixAbo >= 180 && prixAbo <= 260;
    const quotaAtteint  = utilisees >= 5;

    if (!aUnAbonnement || estBasique) {
        return (
            <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
                <Head title="Accès Réservé | ELITE SPORT" />
                <EliteHeader backLabel={__('back')} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <div style={{ background: '#fff', padding: '60px', textAlign: 'center', maxWidth: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', borderTop: '4px solid #c9a84c' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '300' }}>{estBasique ? "Abonnement Basique" : "Pas d'abonnement"}</h2>
                        <div style={{ width: '50px', height: '1px', background: '#c9a84c', margin: '20px auto' }}></div>
                        <p style={{ color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
                            {estBasique
                                ? "Vous disposez actuellement d'un abonnement basique (99 DH). L'accès à l'historique de coaching est réservé aux membres Medium ou VIP."
                                : "Vous n'avez pas encore d'abonnement actif. Pour accéder à l'historique des réservations de coaching, vous devez souscrire à l'une de nos formules Medium ou VIP."}
                        </p>
                        <Link href={route('formules.index')} style={{ background: '#111', color: '#fff', padding: '15px 40px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px' }}>VOIR LES FORMULES</Link>
                    </div>
                </div>
            </div>
        );
    }

    const maintenant = Math.floor(Date.now() / 1000);

    const actives = reservations.filter(r => {
        if (!r.timestamp) return false;
        return (r.statut === 'en_attente' || r.statut === 'confirmee') && r.timestamp > maintenant;
    });

    const archives = reservations.filter(r => {
        if (r.statut === 'annulee' || r.statut === 'refusee' || r.statut === 'expiree') return true;
        if (!r.timestamp) return false;
        return r.timestamp <= maintenant;
    });

    const handleCancel = (id) => {
        if (confirm('Annuler cette session ?')) {
            router.delete(route('reservations.coaching.cancel', id));
        }
    };

    return (
        <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif", color: '#111' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Mes Sessions | ELITE SPORT" />
            <EliteHeader backLabel={__('back')} />
            <main style={{ padding: '60px 20px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '6px', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 'bold' }}>{__('performance_label')}</p>
                        <h1 style={{ fontSize: '48px', fontWeight: '300', marginTop: '10px' }}>{__('my_sessions')}</h1>
                        <div style={{ width: '60px', height: '1px', background: '#c9a84c', margin: '20px auto' }}></div>
                        {estMedium && (
                            <p style={{ fontSize: '13px', color: quotaAtteint ? '#e11d48' : '#999', letterSpacing: '1px' }}>
                                SESSIONS UTILISÉES : <b>{utilisees} / 5</b>
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '25px', borderLeft: '3px solid #c9a84c', paddingLeft: '15px' }}>{__('upcoming_bookings')}</h2>
                        <div style={{ background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            {actives.length > 0 ? actives.map(r => (
                                <div key={r.id} style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f9f9f9' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '400', margin: 0 }}>Coach {r.profil_coach?.user?.prenom} {r.profil_coach?.user?.nom}</h3>
                                        <p style={{ fontSize: '13px', color: '#c9a84c', marginTop: '5px' }}>
                                            {new Date(r.timestamp * 1000).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '9px', padding: '5px 15px', borderRadius: '20px', border: '1px solid', borderColor: r.statut === 'confirmee' ? '#10b981' : '#111', color: r.statut === 'confirmee' ? '#10b981' : '#111', fontWeight: 'bold', letterSpacing: '1px' }}>
                                            {r.statut.toUpperCase().replace('_', ' ')}
                                        </span>
                                        {r.statut === 'en_attente' && (
                                            <button onClick={() => handleCancel(r.id)} style={{ display: 'block', width: '100%', marginTop: '15px', color: '#e11d48', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                {__('cancel').toUpperCase()}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : <p style={{ padding: '60px', textAlign: 'center', color: '#bbb', fontStyle: 'italic' }}>{__('no_upcoming')}</p>}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', marginBottom: '25px' }}>{__('history_label')}</h2>
                        <div style={{ opacity: 0.7 }}>
                            {archives.length > 0 ? archives.map(r => {
                                const estVraimentPasse = r.timestamp <= maintenant;
                                return (
                                    <div key={r.id} style={{ background: '#f9f9f9', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #eee' }}>
                                        <div>
                                            <span style={{ fontSize: '15px', color: '#555' }}>Coach {r.profil_coach?.user?.prenom}</span>
                                            <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{new Date(r.timestamp * 1000).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>
                                            {r.statut === 'annulee' && 'ANNULÉE'}
                                            {r.statut === 'refusee' && 'REFUSÉE'}
                                            {(r.statut === 'expiree' || r.statut === 'confirmee' || r.statut === 'en_attente') && estVraimentPasse && 'SESSION PASSÉE'}
                                        </span>
                                    </div>
                                );
                            }) : <p style={{ textAlign: 'center', color: '#ccc', fontSize: '12px' }}>{__('no_history_coaching')}</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}