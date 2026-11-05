import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

export default function ReservationsIndex({ auth, reservations = [], prixAbo = 0 }) {
    const { delete: destroy, processing } = useForm();
    const { __, isRTL } = useTranslation();

    const aUnAbonnement = prixAbo > 0;

    const annuler = (id) => {
        if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
            destroy(route('reservations.destroy', id));
        }
    };

    const maintenant = new Date();

    if (!aUnAbonnement) {
        return (
            <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
                <Head title="Accès Réservé | ELITE SPORT" />
                <header style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfbf9' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', color: '#111' }}>
                        ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
                    </div>
                    <Link href={route('dashboard')} style={{ color: '#c9a84c', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #c9a84c', paddingBottom: '2px' }}>{__('back')}</Link>
                </header>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                    <div style={{ background: '#fff', padding: '60px', textAlign: 'center', maxWidth: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', borderTop: '4px solid #c9a84c' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '300' }}>Accès Membre</h2>
                        <div style={{ width: '50px', height: '1px', background: '#c9a84c', margin: '20px auto' }}></div>
                        <p style={{ color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
                            Vous n'avez pas d'abonnement actif. Pour accéder à votre planning et réserver nos séances de sport, vous devez souscrire à l'une de nos formules.
                        </p>
                        <Link href={route('formules.index')} style={{ background: '#111', color: '#fff', padding: '15px 40px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px' }}>DÉCOUVRIR NOS FORMULES</Link>
                    </div>
                </div>
            </div>
        );
    }

    const seancesAVenir = reservations.filter(r => {
        const dateSeance = new Date(r.seance?.date_heure);
        return r.statut !== 'annulee' && dateSeance > maintenant;
    });

    const historiqueEtAnnulations = reservations.filter(r => {
        const dateSeance = new Date(r.seance?.date_heure);
        return r.statut === 'annulee' || dateSeance <= maintenant;
    });

    const statusStyle = {
        confirmee:  { background: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' },
        annulee:    { background: '#fee2e2', color: '#991b1b', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' },
        terminee:   { background: '#f1f5f9', color: '#475569', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' },
        en_attente: { background: '#fff3cd', color: '#856404', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' },
    };

    const ReservationCard = ({ r, showCancel = false }) => {
        const dateSeance   = new Date(r.seance?.date_heure);
        const isExpired    = maintenant > dateSeance;
        const displayStatut = (isExpired && r.statut === 'confirmee') ? 'terminee' : r.statut;

        return (
            <div style={{ background: '#fff', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', opacity: (r.statut === 'annulee' || isExpired) ? 0.6 : 1 }}>
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: isExpired ? '#666' : '#111' }}>
                        {r.seance?.sport?.nom || 'Séance'}
                    </h3>
                    <p style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅</span>
                        {r.seance?.date_heure ? new Date(r.seance.date_heure).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) : 'Date non définie'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={statusStyle[displayStatut] || statusStyle.confirmee}>{displayStatut}</span>
                    {showCancel && r.statut !== 'annulee' && !isExpired && (
                        <button onClick={() => annuler(r.id)} disabled={processing}
                            style={{ background: 'transparent', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>
                            {__('cancel')}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Mes Réservations | ELITE SPORT" />
            <header style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfbf9' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', color: '#111' }}>
                    ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
                </div>
                <Link href={route('dashboard')} style={{ color: '#c9a84c', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #c9a84c', paddingBottom: '2px' }}>
                    {__('back')}
                </Link>
            </header>

            <main style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '6px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '15px', fontWeight: 'bold' }}>
                            {__('my_planning')}
                        </p>
                        <h1 style={{ fontSize: '48px', fontWeight: '300', color: '#111' }}>{__('my_reservations')}</h1>
                        <div style={{ width: '60px', height: '1px', background: '#c9a84c', margin: '20px auto 0' }}></div>
                    </div>

                    <div style={{ marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', marginBottom: '20px', borderLeft: '3px solid #c9a84c', paddingLeft: '15px' }}>
                            {__('upcoming_sessions')}
                        </h2>
                        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            {seancesAVenir.length > 0
                                ? seancesAVenir.map(r => <ReservationCard key={r.id} r={r} showCancel={true} />)
                                : <p style={{ padding: '40px', color: '#999', textAlign: 'center', fontStyle: 'italic' }}>{__('no_session_planned')}</p>
                            }
                        </div>
                    </div>

                    <div style={{ marginTop: '80px' }}>
                        <h2 style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '20px', paddingLeft: '15px' }}>
                            {__('history_label')}
                        </h2>
                        <div style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
                            {historiqueEtAnnulations.length > 0
                                ? historiqueEtAnnulations.map(r => <ReservationCard key={r.id} r={r} showCancel={false} />)
                                : <p style={{ padding: '40px', color: '#bbb', textAlign: 'center' }}>{__('no_history')}</p>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}