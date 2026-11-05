import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SeanceEdit({ auth, seance, sports, lieux }) {
    const { data, setData, patch, processing, errors } = useForm({
        date_heure: seance.date_heure.replace(' ', 'T').substring(0, 16),
        capacite: seance.capacite,
        duree: seance.duree,
        sport_id: seance.sport_id,
        lieu_id: seance.lieu_id,
        description: seance.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.seances.update', seance.id), {
            onSuccess: () => console.log("Modification réussie !"),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Modifier Séance" />
            <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '22px' }}>Modifier la séance</h1>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    
                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Description</label>
                        <textarea 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }} 
                        />
                        {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Sport */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Sport</label>
                            <select value={data.sport_id} onChange={e => setData('sport_id', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                {sports.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                            </select>
                        </div>
                        {/* Lieu / Ville */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Lieu</label>
                            <select value={data.lieu_id} onChange={e => setData('lieu_id', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                {lieux.map(l => <option key={l.id} value={l.id}>{l.ville}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        {/* Date Heure */}
                        <div style={{ gridColumn: 'span 1' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Date & Heure</label>
                            <input type="datetime-local" value={data.date_heure} onChange={e => setData('date_heure', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        {/* Capacité */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Capacité</label>
                            <input type="number" value={data.capacite} onChange={e => setData('capacite', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        {/* DURÉE (Nouveau) */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Durée (min)</label>
                            <input type="number" value={data.duree} onChange={e => setData('duree', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>

                    <button type="submit" disabled={processing} style={{ background: '#000', color: '#fff', padding: '15px', border: 'none', borderRadius: '4px', cursor: processing ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                        {processing ? 'EN COURS...' : 'METTRE À JOUR LA SÉANCE'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}