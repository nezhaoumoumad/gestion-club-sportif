import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';

export default function LieuEdit({ auth, lieu }) {
    const { data, setData, post, errors, processing } = useForm({
        ville: lieu.ville,
        pays: lieu.pays,
        adresse: lieu.adresse,
        telephone: lieu.telephone || '',
        description: lieu.description || '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.lieux.update', lieu.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Modifier l'emplacement" />
            
            <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Modifier : {lieu.ville} ({lieu.pays})
                </h1>
                
                <form onSubmit={handleSubmit} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px', 
                    background: '#fff', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    border: '1px solid #eee', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Pays</label>
                        <input 
                            type="text" 
                            value={data.pays} 
                            onChange={e => setData('pays', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                        {errors.pays && <span style={{ color: 'red', fontSize: '12px' }}>{errors.pays}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '600' }}>Ville</label>
                        <input 
                            type="text" 
                            value={data.ville} 
                            onChange={e => setData('ville', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                        {errors.ville && <span style={{ color: 'red', fontSize: '12px' }}>{errors.ville}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: '600' }}>Adresse complète</label>
                        <input 
                            type="text" 
                            value={data.adresse} 
                            onChange={e => setData('adresse', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                        {errors.adresse && <span style={{ color: 'red', fontSize: '12px' }}>{errors.adresse}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: '600' }}>Téléphone</label>
                        <input 
                            type="text" 
                            value={data.telephone} 
                            onChange={e => setData('telephone', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: '600' }}>Description</label>
                        <textarea 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '100px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: '600' }}>Image du club</label>
                        {lieu.image && (
                            <div style={{ width: '120px', height: '80px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #eee' }}>
                                <img src={`/storage/${lieu.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <input 
                            type="file" 
                            onChange={e => setData('image', e.target.files[0])} 
                        />
                        <p style={{ fontSize: '12px', color: '#999' }}>Laissez vide pour conserver l'image actuelle.</p>
                        {errors.image && <span style={{ color: 'red', fontSize: '12px' }}>{errors.image}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', gridColumn: 'span 2' }}>
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