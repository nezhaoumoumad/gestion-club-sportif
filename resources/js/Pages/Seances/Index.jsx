import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

export default function SeancesIndex({ seances = [], auth, mesReservationsIds = [] }) {
    const maintenant = new Date();
    const user = auth?.user;
    const estAbonne = auth?.user?.formule_prix > 0;
    const { __, isRTL } = useTranslation();

    const [filtreSport, setFiltreSport] = useState('');
    const [filtreVille, setFiltreVille] = useState('');

    const seancesAffichees = seances
        .filter(seance => {
            const dateSeance = new Date(seance.date_heure);
            const correspondSport = seance.sport?.nom.toLowerCase().includes(filtreSport.toLowerCase());
            const correspondVille = seance.lieu?.ville.toLowerCase().includes(filtreVille.toLowerCase());
            return dateSeance >= maintenant && correspondSport && correspondVille;
        })
        .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure));

    const reserver = (seanceId, estComplet, estPassee) => {
        if (!user) { router.get(route('login')); return; }
        if (!estAbonne || estPassee || estComplet || mesReservationsIds.includes(seanceId)) return;
        if (confirm('Voulez-vous confirmer votre réservation ?')) {
            router.post(route('reservations.store'), { seance_id: seanceId });
        }
    };

    const styleInput = {
        padding: '12px 20px', borderRadius: '4px', border: '1px solid #ddd',
        fontFamily: "'Georgia', serif", fontSize: '14px', width: '250px', outline: 'none'
    };

    return (
        <>
            <Head title="Séances | ELITE SPORT" />
            <div style={{ minHeight: '100vh', background: '#fcfbf9', color: '#111', fontFamily: "'Georgia', serif" }}
                dir={isRTL ? 'rtl' : 'ltr'}>

                <nav style={{ padding: '30px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '5px', color: '#111', textDecoration: 'none' }}>
                        ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
                    </Link>
                    <Link href={user ? route('dashboard') : '/'} style={{ color: '#c9a84c', fontSize: '12px', letterSpacing: '3px', textDecoration: 'none', fontWeight: '600' }}>
                        {__('back')}
                    </Link>
                </nav>

                <div style={{ padding: '40px 80px' }}>
                    <div style={{ marginBottom: '60px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '52px', fontWeight: '300', marginBottom: '10px' }}>{__('our_sessions')}</h1>
                            <div style={{ width: '60px', height: '2px', background: '#c9a84c', margin: '0 auto 40px' }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', maxWidth: '1300px', margin: '0 auto' }}>
                            <input type="text" placeholder={__('filter_sport')} value={filtreSport} onChange={(e) => setFiltreSport(e.target.value)} style={styleInput} />
                            <input type="text" placeholder={__('filter_city')}  value={filtreVille}  onChange={(e) => setFiltreVille(e.target.value)}  style={styleInput} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px', maxWidth: '1300px', margin: '0 auto' }}>
                        {seancesAffichees.map((seance) => {
                            const dejaReserve    = mesReservationsIds.includes(seance.id);
                            const placesRestantes = seance.capacite - (seance.reservations_count || 0);
                            const estComplet     = placesRestantes <= 0;
                            const estPassee      = new Date(seance.date_heure) < maintenant;
                            const boutonBloque   = estPassee || estComplet || dejaReserve || (user && !estAbonne);

                            return (
                                <div key={seance.id} style={{ background: '#fff', padding: '45px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', borderTop: '4px solid #c9a84c' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <span style={{ fontSize: '10px', color: '#fff', background: '#111', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                                            {seance.sport?.nom}
                                        </span>
                                        <h3 style={{ fontSize: '24px', margin: '25px 0' }}>{seance.description || seance.sport?.nom}</h3>
                                        <div style={{ color: '#666', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <span>📍 {seance.lieu?.ville}</span>
                                            <span>📅 {new Date(seance.date_heure).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                            <span style={{ fontWeight: 'bold', color: '#111' }}>🕒 {new Date(seance.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span style={{ color: '#666' }}>⏳ {__('duration')} : {seance.duree} {__('min')}</span>
                                            <div style={{ marginTop: '10px', color: estComplet ? '#e11d48' : '#111', fontWeight: '500' }}>
                                                {estComplet ? `⚠️ ${__('full').toUpperCase()}` : `👥 ${placesRestantes} ${__('spots_left')}`}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => reserver(seance.id, estComplet, estPassee)}
                                        disabled={boutonBloque}
                                        style={{ marginTop: '40px', width: '100%', padding: '16px', border: 'none', borderRadius: '4px', fontWeight: 'bold', background: boutonBloque ? '#e5e5e5' : '#c9a84c', color: boutonBloque ? '#aaa' : '#fff', cursor: boutonBloque ? 'not-allowed' : 'pointer' }}
                                    >
                                        {dejaReserve ? __('booked') : estComplet ? __('full') : (user && !estAbonne) ? __('subscription_needed') : __('book')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {seancesAffichees.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>{__('no_session_found')}</div>
                    )}
                </div>
            </div>
        </>
    );
}