import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';

export default function SportEdit({ auth, sport }) {
    const { data, setData, post, errors, processing } = useForm({
        nom: sport.nom,
        description: sport.description || '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('admin.sports.update', sport.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Modifier Discipline" />
            
            <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Modifier : {sport.nom}</h1>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Nom du sport</label>
                        <input 
                            type="text" 
                            value={data.nom} 
                            onChange={e => setData('nom', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                        {errors.nom && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nom}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Description</label>
                        <textarea 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '120px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontWeight: '600' }}>Image actuelle</label>
                        {sport.image && (
                            <div style={{ width: '100px', height: '60px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #eee' }}>
                                <img src={`/storage/${sport.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <input 
                            type="file" 
                            onChange={e => setData('image', e.target.files[0])} 
                        />
                        <p style={{ fontSize: '12px', color: '#999' }}>Laissez vide pour conserver l'image actuelle.</p>
                        {errors.image && <span style={{ color: 'red', fontSize: '12px' }}>{errors.image}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button 
                            type="submit" 
                            disabled={processing}
                            style={{ flex: 2, background: '#C5A059', color: '#fff', padding: '14px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                            {processing ? 'TRAITEMENT...' : 'SAUVEGARDER LES MODIFICATIONS'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => window.history.back()}
                            style={{ flex: 1, background: '#f5f5f5', color: '#333', padding: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        >
                            ANNULER
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}