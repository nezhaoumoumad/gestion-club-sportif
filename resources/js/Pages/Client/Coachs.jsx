import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

const EliteHeader = ({ backLabel }) => (
    <nav style={{ padding: '30px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfbf9' }}>
        <Link href="/" style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '5px', color: '#111', textDecoration: 'none' }}>
            ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
        </Link>
        <Link href={route('dashboard')} style={{ color: '#c9a84c', fontSize: '12px', letterSpacing: '3px', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #c9a84c' }}>
            {backLabel}
        </Link>
    </nav>
);

const CoachCard = ({ coach, isBlocked, utilisees, quotaLimit }) => {
    const [showBio, setShowBio] = useState(false);
    const [dateError, setDateError] = useState('');

    const { data, setData, post, processing, reset, errors: localErrors, clearErrors } = useForm({
        profil_coach_id: coach.id,
        date_seance: '',
        duree: '60',
        notes: '',
    });

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setData('date_seance', selectedDate);
        if (localErrors.date_seance) clearErrors('date_seance');
        if (selectedDate) {
            const now = new Date();
            const picked = new Date(selectedDate);
            if (picked < now) { setDateError('La date ne peut pas être dans le passé.'); }
            else { setDateError(''); }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isBlocked || dateError || localErrors.date_seance) return;
        post(route('reservations.coaching.store'), { onSuccess: () => reset(), preserveScroll: true });
    };

    const labelStyle = { display: 'block', fontSize: '9px', color: '#aaa', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' };
    const inputStyle = { width: '100%', border: '1px solid #eee', padding: '12px', fontSize: '12px', background: '#fcfbf9', borderRadius: '0' };

    return (
        <div style={{ background: '#fff', padding: '25px 30px', borderTop: '3px solid #c9a84c', width: '100%', maxWidth: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative' }}>
            {isBlocked && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(5px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px' }}>🔒</div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#e11d48' }}>LIMITE ATTEINTE ({utilisees}/{quotaLimit})</p>
                    <Link href={route('reservations.coaching.index')} style={{ color: '#c9a84c', fontSize: '9px', textDecoration: 'underline' }}>VOIR MES SESSIONS</Link>
                </div>
            )}
            <div style={{ opacity: isBlocked ? 0.2 : 1 }}>
                <p style={{ fontSize: '9px', color: '#c9a84c', fontWeight: 'bold', letterSpacing: '2px' }}>{coach.specialite || 'ELITE COACHING'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '22px', fontFamily: "'Georgia', serif", margin: 0 }}>{coach.user?.prenom} {coach.user?.nom}</h3>
                    <button onClick={() => setShowBio(!showBio)} style={{ background: 'none', border: 'none', color: '#c9a84c', fontSize: '9px', cursor: 'pointer' }}>
                        {showBio ? '− FERMER' : '+ DÉTAILS'}
                    </button>
                </div>
                {showBio && <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>{coach.bio}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={labelStyle}>DATE ET HEURE</label>
                        <input type="datetime-local" onChange={handleDateChange}
                            style={{...inputStyle, border: (dateError || localErrors.date_seance) ? '1px solid #e11d48' : '1px solid #eee'}} required />
                        {dateError && <p style={{ color: '#e11d48', fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>{dateError}</p>}
                        {localErrors.date_seance && <p style={{ color: '#e11d48', fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>{localErrors.date_seance}</p>}
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={labelStyle}>DURÉE SOUHAITÉE</label>
                        <select onChange={e => setData('duree', e.target.value)} style={inputStyle}>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '22px' }}>
                        <label style={labelStyle}>NOTES</label>
                        <textarea onChange={e => setData('notes', e.target.value)} style={{ ...inputStyle, minHeight: '70px' }} />
                    </div>
                    <button type="submit" disabled={processing || isBlocked || !!dateError || !!localErrors.date_seance}
                        style={{ width: '100%', background: '#111', color: '#fff', padding: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: (processing || isBlocked || !!dateError || !!localErrors.date_seance) ? 0.5 : 1 }}>
                        RÉSERVER LA SÉANCE
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function ClientCoachs({ coachs = [], prixAbo = 0, utilisees = 0 }) {
    console.log("CHIFFRE UTILISEES REÇU DU SERVEUR :", utilisees);
    const { __, isRTL } = useTranslation();

    const aUnAbonnement = prixAbo > 0;
    const estBasique    = aUnAbonnement && prixAbo <= 110;
    const estMedium     = prixAbo >= 180 && prixAbo <= 260;
    const quotaLimit    = 5;
    const quotaAtteint  = estMedium && utilisees >= quotaLimit;

    if (!aUnAbonnement || estBasique) {
        return (
            <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
                <Head title="Accès Réservé" />
                <EliteHeader backLabel={__('back')} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <div style={{ background: '#fff', padding: '60px', textAlign: 'center', maxWidth: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', borderTop: '4px solid #c9a84c' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '300' }}>{estBasique ? "Formule Incompatible" : "Accès Membre"}</h2>
                        <div style={{ width: '50px', height: '1px', background: '#c9a84c', margin: '20px auto' }}></div>
                        <p style={{ color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
                            {estBasique
                                ? "Votre abonnement actuel (99 DH) ne permet pas d'effectuer des réservations de coaching. Pour bénéficier de séances privées avec nos coachs, vous devez passer à une formule Medium ou VIP."
                                : "L'accès à nos coachs est exclusivement réservé aux membres abonnés. Souscrivez dès maintenant à une formule Medium ou VIP pour commencer votre accompagnement personnalisé."}
                        </p>
                        <Link href={route('formules.index')} style={{ background: '#111', color: '#fff', padding: '15px 40px', textDecoration: 'none', fontWeight: 'bold' }}>VOIR LES FORMULES</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Georgia', serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Nos Coachs" />
            <EliteHeader backLabel={__('back')} />
            <main style={{ padding: '60px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '6px', color: '#c9a84c', textTransform: 'uppercase' }}>Elite Coaching</p>
                    <h1 style={{ fontSize: '48px', fontWeight: '300' }}>Nos Coachs</h1>
                    <div style={{ width: '60px', height: '1px', background: '#c9a84c', margin: '20px auto' }}></div>
                    {estMedium && (
                        <p style={{ fontSize: '12px', color: quotaAtteint ? '#e11d48' : '#999' }}>
                            SESSIONS UTILISÉES : <b>{utilisees} / {quotaLimit}</b>
                        </p>
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', justifyItems: 'center', maxWidth: '850px', margin: '0 auto' }}>
                    {coachs.map(coach => (
                        <CoachCard key={coach.id} coach={coach} isBlocked={quotaAtteint} utilisees={utilisees} quotaLimit={quotaLimit} />
                    ))}
                </div>
            </main>
        </div>
    );
}