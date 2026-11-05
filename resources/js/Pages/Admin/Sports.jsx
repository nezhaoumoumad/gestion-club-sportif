import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head, router } from '@inertiajs/react';

export default function Sports({ auth, sports }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        nom: '',
        description: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.sports.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion des Disciplines" />
            
            <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Disciplines & Sports</h1>

                {/* Formulaire de création */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Ajouter un sport</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <input 
                                type="text" placeholder="Nom du sport (ex: Yoga, Boxe...)" 
                                value={data.nom} onChange={e => setData('nom', e.target.value)}
                                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                            {errors.nom && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nom}</span>}
                        </div>

                        <textarea 
                            placeholder="Description du sport..." 
                            value={data.description} onChange={e => setData('description', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', color: '#666' }}>Image du sport :</label>
                            <input 
                                type="file" 
                                onChange={e => setData('image', e.target.files[0])}
                                style={{ padding: '10px', background: '#f9f9f9', borderRadius: '6px' }}
                            />
                            {errors.image && <span style={{ color: 'red', fontSize: '12px' }}>{errors.image}</span>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            style={{ background: '#000', color: '#fff', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}
                        >
                            {processing ? 'ENREGISTREMENT...' : 'AJOUTER LA DISCIPLINE'}
                        </button>
                    </form>
                </div>

                {/* Liste des sports */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                    {sports.map(sport => (
                        <div key={sport.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ height: '160px', background: '#f4f4f4' }}>
                                {sport.image ? (
                                    <img src={`/storage/${sport.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={sport.nom} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Pas d'image</div>
                                )}
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', textTransform: 'uppercase' }}>{sport.nom}</h3>
                                <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px', height: '42px', overflow: 'hidden' }}>{sport.description}</p>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => router.get(route('admin.sports.edit', sport.id))}
                                        style={{ flex: 1, padding: '10px', border: '1px solid #C5A059', color: '#C5A059', background: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        MODIFIER
                                    </button>
                                    <button 
                                        onClick={() => confirm('Voulez-vous supprimer ce sport ?') && router.delete(route('admin.sports.destroy', sport.id))}
                                        style={{ flex: 1, padding: '10px', border: '1px solid #ff4d4d', color: '#ff4d4d', background: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        SUPPRIMER
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}