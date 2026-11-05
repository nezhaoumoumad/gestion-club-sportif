import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

//Badge statut compte
const BadgeCompte = ({ statut }) => {
    const isActif = statut === 'actif';
    return (
        <span style={{
            fontSize: '9px',
            fontWeight: '700',
            color: isActif ? '#27ae60' : '#e67e22',
            background: isActif ? 'rgba(39,174,96,0.08)' : 'rgba(230,126,34,0.08)',
            padding: '2px 7px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
        }}>
            {isActif ? 'ACTIF' : 'INACTIF'}
        </span>
    );
};

//Badge abonnement (pour onglet 2)
const BadgeAbo = ({ statut, dateFin }) => {
    const estExpire = !dateFin || new Date(dateFin) < new Date();
    const label  = statut === 'actif' && !estExpire ? 'ACTIF' : 'EXPIRÉ';
    const color  = statut === 'actif' && !estExpire ? '#27ae60' : '#e74c3c';
    const bg     = statut === 'actif' && !estExpire ? 'rgba(39,174,96,0.08)' : 'rgba(231,76,60,0.08)';
    return (
        <span style={{
            fontSize: '9px', fontWeight: '700', color, background: bg,
            padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.5px',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
            {label}
        </span>
    );
};

//Tableau générique
const Tableau = ({ colonnes, lignes, total, labelTotal, onglet }) => {
    const goldColor = '#c9a84c';
    const gridCols  = onglet === 1
        ? '1.5fr 1.5fr 2.5fr 1fr 1.2fr 0.8fr'
        : '1.5fr 1.5fr 2.5fr 1fr 1.2fr 0.9fr 0.8fr';

    return (
        <div style={{
            background: '#fff', borderRadius: '8px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            overflow: 'hidden',
        }}>
            <div style={{
                display: 'grid', gridTemplateColumns: gridCols,
                padding: '14px 28px', background: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
            }}>
                {colonnes.map(col => (
                    <span key={col} style={{
                        fontSize: '9px', letterSpacing: '1.5px',
                        textTransform: 'uppercase', color: '#aaa', fontWeight: '600',
                    }}>
                        {col}
                    </span>
                ))}
            </div>

            {lignes.length > 0 ? lignes.map((p, i) => (
                <div
                    key={i}
                    style={{
                        display: 'grid', gridTemplateColumns: gridCols,
                        padding: '16px 28px',
                        borderBottom: i < lignes.length - 1 ? '1px solid #fafafa' : 'none',
                        alignItems: 'center', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fffdf7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{p.nom}</span>
                    <span style={{ fontSize: '13px', color: '#444' }}>{p.prenom}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{p.email}</span>
                    <span style={{ fontSize: '11px', color: '#bbb' }}>{p.date}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: goldColor }}>
                        {p.montant}{' '}
                        <span style={{ fontSize: '10px', color: '#bbb', fontWeight: '400' }}>DH</span>
                    </span>

                    {onglet === 1 && <BadgeCompte statut={p.statut_compte} />}

                    {onglet === 2 && (
                        <>
                            <BadgeAbo statut={p.statut_abo} dateFin={p.date_fin} />
                            <span style={{
                                fontSize: '9px', fontWeight: '600',
                                color: p.role === 3 ? '#8e44ad' : p.role === 1 ? '#2980b9' : '#555',
                                background: p.role === 3 ? 'rgba(142,68,173,0.08)' : p.role === 1 ? 'rgba(41,128,185,0.08)' : 'rgba(0,0,0,0.04)',
                                padding: '2px 7px', borderRadius: '20px',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>
                                {p.role === 1 ? 'ADMIN' : p.role === 3 ? 'COACH' : 'CLIENT'}
                            </span>
                        </>
                    )}
                </div>
            )) : (
                <div style={{ padding: '50px', textAlign: 'center', color: '#ccc', fontSize: '13px' }}>
                    Aucun paiement trouvé.
                </div>
            )}

            <div style={{
                display: 'grid', gridTemplateColumns: gridCols,
                padding: '18px 28px', background: '#fafafa',
                borderTop: `2px solid ${goldColor}`, alignItems: 'center',
            }}>
                <span style={{
                    gridColumn: '1 / 5',
                    fontSize: '10px', letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: '#888', fontWeight: '600',
                }}>
                    {labelTotal}
                </span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
                    {total}{' '}
                    <span style={{ fontSize: '12px', color: goldColor, fontWeight: '600' }}>DH</span>
                </span>
            </div>
        </div>
    );
};

export default function Paiements({ auth, paiements_actifs, total_actifs, tous_paiements, total_general }) {
    const goldColor = '#c9a84c';
    const [onglet, setOnglet] = useState(1);

    const styleOnglet = (actif) => ({
        padding: '10px 24px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: actif ? '#111' : '#aaa',
        borderBottom: actif ? `2px solid ${goldColor}` : '2px solid transparent',
        transition: 'all 0.2s',
        fontFamily: "'Inter', sans-serif",
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Paiements" />

            <div style={{
                padding: '60px 40px', background: '#fcfbf9',
                minHeight: '100vh', fontFamily: "'Inter', sans-serif",
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    <div style={{ marginBottom: '40px' }}>
                        <Link
                            href={route('admin.dashboard')}
                            style={{
                                fontSize: '11px', letterSpacing: '1px',
                                textTransform: 'uppercase', color: '#aaa',
                                textDecoration: 'none', display: 'inline-flex',
                                alignItems: 'center', gap: '6px', marginBottom: '20px',
                            }}
                        >
                            ← Retour au Dashboard
                        </Link>
                        <h1 style={{ fontSize: '32px', fontWeight: '200', color: '#111', margin: '0' }}>
                            Paiements
                        </h1>
                        <p style={{ fontSize: '13px', color: '#999', marginTop: '8px', lineHeight: '1.6' }}>
                            Gestion et suivi de tous les paiements du club.
                        </p>
                        <div style={{ width: '30px', height: '1px', background: goldColor, marginTop: '20px' }}></div>
                    </div>

                    <div style={{
                        display: 'flex', borderBottom: '1px solid #eee',
                        marginBottom: '30px', gap: '0',
                    }}>
                        <button style={styleOnglet(onglet === 1)} onClick={() => setOnglet(1)}>
                            Abonnements Actifs
                        </button>
                        <button style={styleOnglet(onglet === 2)} onClick={() => setOnglet(2)}>
                            Historique Complet
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <p style={{ fontSize: '11px', color: '#bbb', margin: 0, letterSpacing: '0.5px' }}>
                            {onglet === 1
                                ? `${paiements_actifs?.length ?? 0} paiement(s) actif(s)`
                                : `${tous_paiements?.length ?? 0} paiement(s) au total`}
                        </p>
                    </div>

                    {onglet === 1 && (
                        <Tableau
                            onglet={1}
                            colonnes={['Nom', 'Prénom', 'Email', 'Date', 'Montant', 'Compte']}
                            lignes={paiements_actifs}
                            total={total_actifs}
                            labelTotal="Total Recettes Actives"
                        />
                    )}

                    {onglet === 2 && (
                        <Tableau
                            onglet={2}
                            colonnes={['Nom', 'Prénom', 'Email', 'Date', 'Montant', 'Abonnement', 'Rôle']}
                            lignes={tous_paiements}
                            total={total_general}
                            labelTotal="Total Général — Toutes Recettes"
                        />
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}