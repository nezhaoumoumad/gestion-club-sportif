import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const gold = '#c9a84c';

const s = {
    page:     { padding: '50px 40px', background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    inner:    { maxWidth: '1200px', margin: '0 auto' },
    title:    { fontSize: '28px', fontWeight: '200', color: '#111', margin: '0 0 6px' },
    sub:      { fontSize: '12px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' },
    divider:  { width: '30px', height: '1px', background: gold, margin: '20px 0 40px' },
    tabWrap:  { display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: '40px' },
    tab: (active) => ({
        padding: '14px 0', marginRight: '35px', fontSize: '11px', fontWeight: '700',
        letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
        color: active ? '#111' : '#bbb', background: 'none', border: 'none',
        borderBottom: `2px solid ${active ? gold : 'transparent'}`, transition: 'all 0.2s',
    }),
    table:    { width: '100%', borderCollapse: 'collapse' },
    th:       { fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#bbb', fontWeight: '600', padding: '0 0 16px', textAlign: 'left' },
    td:       { padding: '22px 0', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle', fontSize: '13px', color: '#333' },
    badge: (type) => {
        const map = {
            actif:           { color: '#2e7d32', bg: '#f0faf0' },
            desactive_admin: { color: '#c62828', bg: '#fff5f5' },
            non_disponible:  { color: '#e65100', bg: '#fff8f0' },
        };
        const c = map[type] || map.non_disponible;
        return { display: 'inline-block', fontSize: '9px', fontWeight: '700', letterSpacing: '1px',
                 textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px',
                 color: c.color, background: c.bg };
    },
    btn: (color) => ({
        fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
        color, background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px 0', marginRight: '18px',
    }),
    overlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal:    { background: '#fff', borderRadius: '8px', padding: '40px', width: '100%',
                maxWidth: '620px', maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    mTitle:   { fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 4px' },
    mSub:     { fontSize: '11px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' },
    mDivider: { width: '30px', height: '1px', background: gold, margin: '10px 0 25px' },
    label:    { display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#888', marginBottom: '6px' },
    input:    { width: '100%', border: '1px solid #e8e8e8', borderRadius: '4px', padding: '10px 14px',
                fontSize: '13px', color: '#111', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', border: '1px solid #e8e8e8', borderRadius: '4px', padding: '10px 14px',
                fontSize: '13px', color: '#111', outline: 'none', boxSizing: 'border-box',
                resize: 'vertical', minHeight: '90px' },
    btnPrimary: { background: gold, color: '#fff', border: 'none', borderRadius: '4px',
                  padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
                  textTransform: 'uppercase', cursor: 'pointer' },
    btnCancel:  { background: 'transparent', color: '#888', border: '1px solid #e0e0e0',
                  borderRadius: '4px', padding: '11px 22px', fontSize: '11px', fontWeight: '600',
                  letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', marginRight: '12px' },
    sectionTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: '#aaa', margin: '20px 0 12px' },
    emptySection: { fontSize: '12px', color: '#ccc', fontStyle: 'italic', padding: '6px 0 12px' },
};

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div style={s.overlay}>
            <div style={{ ...s.modal, maxWidth: '420px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff5f5',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <p style={{ fontSize: '14px', color: '#333', margin: '0 0 30px', lineHeight: '1.6' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button style={s.btnCancel} onClick={onCancel}>Annuler</button>
                    <button style={{ ...s.btnPrimary, background: '#e53935' }} onClick={onConfirm}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}


function VoirModal({ coach, onClose }) {
    const reservations = coach.reservations || [];
    const confirmees  = reservations.filter(r => r.statut === 'confirmee');
    const enAttente   = reservations.filter(r => r.statut === 'en_attente');
    const historique  = reservations.filter(r => ['annulee', 'expiree', 'terminee', 'refusee'].includes(r.statut));

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    const borderColors = { confirmee: '#2e7d32', en_attente: gold, terminee: '#9e9e9e', annulee: '#e53935', expiree: '#9e9e9e', refusee: '#e53935' };
    const bgColors     = { confirmee: '#f0faf0', en_attente: '#fffdf5', terminee: '#fafafa', annulee: '#fff5f5', expiree: '#fafafa', refusee: '#fff5f5' };

    const ResCard = ({ r }) => (
        <div style={{ borderLeft: `3px solid ${borderColors[r.statut] || '#ccc'}`, background: bgColors[r.statut] || '#fafafa',
                      borderRadius: '4px', padding: '12px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '600', color: '#111' }}>
                        {r.client ? `${r.client.prenom} ${r.client.nom}` : 'Client inconnu'}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>
                        {formatDate(r.date_seance)} · {r.duree} min
                    </p>
                    {r.notes && <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#aaa', fontStyle: 'italic' }}>"{r.notes}"</p>}
                </div>
                <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: borderColors[r.statut] || '#ccc' }}>
                    {r.statut.replace('_', ' ')}
                </span>
            </div>
        </div>
    );

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={s.mTitle}>{coach.user?.prenom} {coach.user?.nom}</p>
                        <p style={s.mSub}>{coach.specialite}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '22px' }}>×</button>
                </div>
                <div style={s.mDivider}></div>

                <div style={{ background: '#fafafa', borderRadius: '6px', padding: '14px 18px', marginBottom: '24px',
                              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Email : <span style={{ color: '#333' }}>{coach.user?.email}</span></p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Tél : <span style={{ color: '#333' }}>{coach.user?.telephone || 'N/A'}</span></p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Total réservations : <span style={{ color: '#333', fontWeight: '600' }}>{reservations.length}</span></p>
                </div>

                <p style={s.sectionTitle}>✓ Confirmées ({confirmees.length})</p>
                {confirmees.length === 0 ? <p style={s.emptySection}>Aucune séance confirmée.</p> : confirmees.map(r => <ResCard key={r.id} r={r} />)}

                <p style={s.sectionTitle}>⏳ En attente ({enAttente.length})</p>
                {enAttente.length === 0 ? <p style={s.emptySection}>Aucune demande en attente.</p> : enAttente.map(r => <ResCard key={r.id} r={r} />)}

                <p style={s.sectionTitle}>Terminées / Annulées ({historique.length})</p>
                {historique.length === 0 ? <p style={s.emptySection}>Aucun historique.</p> : historique.map(r => <ResCard key={r.id} r={r} />)}

                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button style={s.btnCancel} onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}

function ModifierModal({ coach, onClose }) {
    const [form, setForm] = useState({
        prenom:     coach.user?.prenom    || '',
        nom:        coach.user?.nom       || '',
        email:      coach.user?.email     || '',
        telephone:  coach.user?.telephone || '',
        specialite: coach.specialite      || '',
        bio:        coach.bio             || '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const submit = () => {
        setLoading(true);
        router.patch(route('admin.coachs.update', coach.id), form, {
            onSuccess: () => { setLoading(false); onClose(); },
            onError:   (err) => { setErrors(err); setLoading(false); },
        });
    };

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={s.mTitle}>Modifier le profil</p>
                        <p style={s.mSub}>{coach.user?.prenom} {coach.user?.nom}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '22px' }}>×</button>
                </div>
                <div style={s.mDivider}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {[['Prénom', 'prenom'], ['Nom', 'nom']].map(([label, field]) => (
                        <div key={field}>
                            <label style={s.label}>{label}</label>
                            <input value={form[field]} onChange={change(field)}
                                   style={{ ...s.input, borderColor: errors[field] ? '#e53935' : '#e8e8e8' }} />
                            {errors[field] && <p style={{ color: '#e53935', fontSize: '11px', margin: '4px 0 0' }}>{errors[field]}</p>}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {[['Email', 'email', 'email'], ['Téléphone', 'telephone', 'text']].map(([label, field, type]) => (
                        <div key={field}>
                            <label style={s.label}>{label}</label>
                            <input type={type} value={form[field]} onChange={change(field)}
                                   style={{ ...s.input, borderColor: errors[field] ? '#e53935' : '#e8e8e8' }} />
                            {errors[field] && <p style={{ color: '#e53935', fontSize: '11px', margin: '4px 0 0' }}>{errors[field]}</p>}
                        </div>
                    ))}
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={s.label}>Spécialité</label>
                    <input value={form.specialite} onChange={change('specialite')}
                           style={{ ...s.input, borderColor: errors.specialite ? '#e53935' : '#e8e8e8' }} />
                    {errors.specialite && <p style={{ color: '#e53935', fontSize: '11px', margin: '4px 0 0' }}>{errors.specialite}</p>}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={s.label}>Bio professionnelle</label>
                    <textarea value={form.bio} onChange={change('bio')} style={s.textarea}
                              placeholder="Expérience et compétences du coach..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={s.btnCancel} onClick={onClose}>Annuler</button>
                    <button style={s.btnPrimary} onClick={submit} disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminCoachs({ auth, coachs }) {
    const [onglet,      setOnglet]      = useState('actifs');
    const [voirCoach,   setVoirCoach]   = useState(null);
    const [modifCoach,  setModifCoach]  = useState(null);
    const [confirmData, setConfirmData] = useState(null);

    const actifs   = coachs.filter(c => c.statut === 'actif');
    const inactifs = coachs.filter(c => c.statut !== 'actif');
    const liste    = onglet === 'actifs' ? actifs : inactifs;

    const handleToggle = (coach) => {
        const msg = coach.statut === 'actif'
            ? `Désactiver ${coach.user?.prenom} ${coach.user?.nom} ? Il ne pourra plus accéder à son dashboard.`
            : `Réactiver ${coach.user?.prenom} ${coach.user?.nom} ?`;
        setConfirmData({
            message: msg,
            action: () => router.patch(route('admin.coachs.toggle', coach.id), {}, {
                onSuccess: () => setConfirmData(null),
            }),
        });
    };

    const handleRetirer = (coach) => {
        setConfirmData({
            message: `Supprimer définitivement ${coach.user?.prenom} ${coach.user?.nom} ? Cette action est irréversible.`,
            action: () => router.delete(route('admin.coachs.destroy', coach.id), {
                onSuccess: () => setConfirmData(null),
            }),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion des Coachs" />

            <div style={s.page}>
                <div style={s.inner}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={s.title}>Gestion des Coachs</h1>
                            <p style={s.sub}>Administration · Équipe</p>
                        </div>
                    </div>

                    <div style={s.divider}></div>

                    {/* ONGLETS */}
                    <div style={s.tabWrap}>
                        <button style={s.tab(onglet === 'actifs')}   onClick={() => setOnglet('actifs')}>
                            Actifs ({actifs.length})
                        </button>
                        <button style={s.tab(onglet === 'inactifs')} onClick={() => setOnglet('inactifs')}>
                            Inactifs ({inactifs.length})
                        </button>
                    </div>

                    {/* TABLEAU */}
                    {liste.length === 0 ? (
                        <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '60px 0' }}>
                            Aucun coach dans cette catégorie.
                        </p>
                    ) : (
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Prénom</th>
                                    <th style={s.th}>Nom</th>
                                    <th style={s.th}>Email</th>
                                    <th style={s.th}>Spécialité</th>
                                    <th style={s.th}>Statut</th>
                                    <th style={s.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liste.map(coach => (
                                    <tr key={coach.id}>
                                        <td style={s.td}>{coach.user?.prenom}</td>
                                        <td style={s.td} ><strong>{coach.user?.nom}</strong></td>
                                        <td style={s.td}>
                                            <div style={{ fontSize: '12px' }}>{coach.user?.email}</div>
                                            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{coach.user?.telephone || 'N/A'}</div>
                                        </td>
                                        <td style={s.td}><span style={{ fontSize: '12px', color: '#666' }}>{coach.specialite}</span></td>
                                        <td style={s.td}>
                                            <span style={s.badge(coach.statut)}>
                                                {coach.statut === 'actif'           && 'ACTIF'}
                                                {coach.statut === 'desactive_admin' && 'DÉSACTIVÉ PAR ADMIN'}
                                                {coach.statut === 'non_disponible'  && 'NON DISPONIBLE'}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <button style={s.btn('#111')}     onClick={() => setVoirCoach(coach)}>VOIR</button>
                                            <button style={s.btn(gold)}       onClick={() => setModifCoach(coach)}>MODIFIER</button>
                                            {coach.statut === 'actif'
                                            ? <button style={s.btn('#1976d2')} onClick={() => handleToggle(coach)}>DÉSACTIVER</button>
                                            : <button style={s.btn('#2e7d32')} onClick={() => handleToggle(coach)}>ACTIVER</button>
                                            }
                                            <button style={s.btn('#e53935')}  onClick={() => handleRetirer(coach)}>RETIRER</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {voirCoach   && <VoirModal     coach={voirCoach}  onClose={() => setVoirCoach(null)}  />}
            {modifCoach  && <ModifierModal coach={modifCoach} onClose={() => setModifCoach(null)} />}
            {confirmData && <ConfirmModal  message={confirmData.message} onConfirm={confirmData.action} onCancel={() => setConfirmData(null)} />}
        </AuthenticatedLayout>
    );
}