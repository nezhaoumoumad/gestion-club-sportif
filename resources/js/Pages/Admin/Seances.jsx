import React, { useState } from 'react';
import { useForm, Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Seances({ auth, seances, sports, lieux }) {
    const [ongletActif, setOngletActif] = useState('actuelles');
    const goldColor = '#C5A059';

    const { data, setData, post, processing, reset, errors } = useForm({
        date_heure: '', 
        capacite: '', 
        duree: '60', 
        sport_id: '', 
        lieu_id: '',
        description: '' 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.seances.store'), { 
            onSuccess: () => {
                console.log("Séance créée avec succès");
                reset();
            },
            onError: (err) => {
                console.error("Erreurs lors de la création :", err);
            }
        });
    };

    // Filtrage des séances pour les onglets
    const maintenant = new Date();
    const seancesActuelles = seances.filter(s => new Date(s.date_heure) >= maintenant);
    const seancesPassees = seances.filter(s => new Date(s.date_heure) < maintenant);

    const tabStyle = (estActif) => ({
        padding: '15px 30px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        color: estActif ? '#000' : '#999',
        borderBottom: estActif ? `3px solid ${goldColor}` : '1px solid #eee',
        flex: 1,
        textAlign: 'center',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease'
    });

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    fontFamily: "'Georgia', serif" 
                }}>
                    {/* Logo ELITESPORT */}
                    <Link href="/" style={{ 
                        fontSize: '24px', 
                        fontWeight: '900', 
                        letterSpacing: '6px', 
                        color: '#000', 
                        textDecoration: 'none',
                        textTransform: 'uppercase'
                    }}>
                        ELITE<span style={{ color: goldColor }}>SPORT</span>
                    </Link>

                    {/* Bouton Retour */}
                    <Link 
                        href={route('dashboard')} 
                        style={{ 
                            color: goldColor, 
                            fontSize: '12px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '3px', 
                            textDecoration: 'none', 
                            fontWeight: 'bold', 
                            borderBottom: `1px solid ${goldColor}`,
                            paddingBottom: '2px'
                        }}
                    >
                        ← RETOUR
                    </Link>
                </div>
            }
        >
            <Head title="Gestion Planning Admin" />
            
            <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Georgia', serif" }}>
                
                {/* TITRES CORRIGÉS */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '4px', color: goldColor, textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
                        Elite Sport Administration
                    </p>
                    <h1 style={{ fontSize: '36px', fontWeight: '300', color: '#111', margin: 0 }}>
                        Gestion des Séances
                    </h1>
                    <div style={{ width: '50px', height: '1px', background: goldColor, margin: '20px auto' }}></div>
                </div>

                {/* Formulaire de création */}
                <form onSubmit={handleSubmit} style={{ 
                    display: 'grid', 
                    gap: '15px', 
                    marginBottom: '40px', 
                    background: '#fff', 
                    padding: '25px', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600', fontSize: '14px' }}>Titre / Description</label>
                        <textarea 
                            placeholder="Ex: Séance de cardio intense..." 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }}
                        />
                        {errors.description && <span style={{ color: 'red', fontSize: '12px' }}>{errors.description}</span>}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600', fontSize: '14px' }}>Date et Heure</label>
                        <input 
                            type="datetime-local" 
                            value={data.date_heure} 
                            onChange={e => setData('date_heure', e.target.value)} 
                            required 
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.date_heure && <span style={{ color: 'red', fontSize: '12px' }}>{errors.date_heure}</span>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: '600', fontSize: '14px' }}>Capacité (pers.)</label>
                            <input 
                                type="number" 
                                placeholder="Ex: 15" 
                                value={data.capacite} 
                                onChange={e => setData('capacite', e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} 
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: '600', fontSize: '14px' }}>Durée (min)</label>
                            <input 
                                type="number" 
                                placeholder="60" 
                                value={data.duree} 
                                onChange={e => setData('duree', e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <select 
                            value={data.sport_id} 
                            onChange={e => setData('sport_id', e.target.value)} 
                            required
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                            <option value="">-- Choisir Sport --</option>
                            {sports.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>

                        <select 
                            value={data.lieu_id} 
                            onChange={e => setData('lieu_id', e.target.value)} 
                            required
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                            <option value="">-- Choisir Lieu --</option>
                            {lieux.map(l => <option key={l.id} value={l.id}>{l.ville}</option>)}
                        </select>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div style={{ background: '#ffeeee', padding: '10px', borderLeft: '4px solid red', marginBottom: '10px' }}>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'red', fontSize: '13px' }}>
                                {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                            </ul>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={processing} 
                        style={{ 
                            background: '#000', 
                            color: '#fff', 
                            padding: '15px', 
                            border: '1px solid #000', 
                            borderRadius: '4px',
                            cursor: processing ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold',
                            marginTop: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        {processing ? 'TRAITEMENT EN COURS...' : 'CRÉER LA SÉANCE'}
                    </button>
                </form>

                {/* Système d'onglets */}
                <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #eee' }}>
                    <div style={tabStyle(ongletActif === 'actuelles')} onClick={() => setOngletActif('actuelles')}>
                        SÉANCES À VENIR ({seancesActuelles.length})
                    </div>
                    <div style={tabStyle(ongletActif === 'passees')} onClick={() => setOngletActif('passees')}>
                        SÉANCES PASSÉES ({seancesPassees.length})
                    </div>
                </div>

                {/* Liste des séances */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(ongletActif === 'actuelles' ? seancesActuelles : seancesPassees).length > 0 ? (
                        (ongletActif === 'actuelles' ? seancesActuelles : seancesPassees).map(s => (
                            <SeanceCard key={s.id} s={s} estPassee={ongletActif === 'passees'} goldColor={goldColor} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Aucune séance trouvée.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const SeanceCard = ({ s, estPassee, goldColor }) => {
    const handleDelete = () => {
        if (confirm('Voulez-vous vraiment supprimer cette séance ?')) {
            router.delete(route('admin.seances.destroy', s.id));
        }
    };
    const handleEdit = () => router.get(route('admin.seances.edit', s.id));
    const handleShowInscrits = () => router.get(route('admin.seances.inscrits', s.id));

    return (
        <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '12px', 
            padding: '20px', 
            background: estPassee ? '#f9f9f9' : '#fff', 
            opacity: estPassee ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {s.sport?.nom || 'Sport inconnu'}
                </h3>
                <span style={{ fontSize: '14px', fontWeight: '600', color: goldColor }}>
                    {new Date(s.date_heure).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {new Date(s.date_heure).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>{s.description || "Aucune description fournie."}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#777', fontSize: '14px' }}>
                    <span>📍 {s.lieu?.ville || 'Lieu non défini'}</span>
                    <span style={{ color: '#ddd' }}>|</span>
                    <span>⏳ {s.duree} min</span>
                    <span style={{ color: '#ddd' }}>|</span>
                    <span style={{ fontWeight: '500', color: '#444' }}>
                        👥 {s.reservations?.length || 0} / {s.capacite} inscrits
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleShowInscrits} style={{ padding: '8px 12px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>LISTE</button>
                    {!estPassee && (
                        <button onClick={handleEdit} style={{ padding: '8px 12px', background: '#fff', border: `1px solid ${goldColor}`, color: goldColor, borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>MODIFIER</button>
                    )}
                    <button onClick={handleDelete} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>SUPPRIMER</button>
                </div>
            </div>
        </div>
    );
};