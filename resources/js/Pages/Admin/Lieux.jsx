import React, { useRef } from 'react';
import { useForm, Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Lieux({ auth, lieux }) {
    const fileInput = useRef();
    const goldColor = '#C5A059';

    const { data, setData, post, reset, errors, processing } = useForm({
        ville: '', pays: '', adresse: '', telephone: '', description: '', image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.lieux.store'), { 
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            } 
        });
    };

    const errorStyle = { color: 'red', fontSize: '12px', marginTop: '4px' };

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
            <Head title="Gestion des Lieux" />
            
            <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Georgia', serif" }}>
                
                {/* BLOC TITRE IDENTIQUE À L'AUTRE FICHIER */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '4px', color: goldColor, textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
                        Elite Sport Administration
                    </p>
                    <h1 style={{ fontSize: '36px', fontWeight: '300', color: '#111', margin: 0 }}>
                        Disciplines & Sports
                    </h1>
                    <div style={{ width: '50px', height: '1px', background: goldColor, margin: '20px auto' }}></div>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #eee' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Ajouter un nouvel emplacement</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        
                        {/* PAYS */}
                        <div>
                            <input type="text" placeholder="Pays" value={data.pays} onChange={e => setData('pays', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.pays ? '1px solid red' : '1px solid #ddd' }} />
                            {errors.pays && <div style={errorStyle}>{errors.pays}</div>}
                        </div>

                        {/* VILLE */}
                        <div>
                            <input type="text" placeholder="Ville" value={data.ville} onChange={e => setData('ville', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.ville ? '1px solid red' : '1px solid #ddd' }} />
                            {errors.ville && <div style={errorStyle}>{errors.ville}</div>}
                        </div>

                        {/* ADRESSE */}
                        <div>
                            <input type="text" placeholder="Adresse" value={data.adresse} onChange={e => setData('adresse', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.adresse ? '1px solid red' : '1px solid #ddd' }} />
                            {errors.adresse && <div style={errorStyle}>{errors.adresse}</div>}
                        </div>

                        {/* TELEPHONE */}
                        <div>
                            <input type="text" placeholder="Téléphone" value={data.telephone} onChange={e => setData('telephone', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.telephone ? '1px solid red' : '1px solid #ddd' }} />
                            {errors.telephone && <div style={errorStyle}>{errors.telephone}</div>}
                        </div>

                        {/* DESCRIPTION */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <textarea placeholder="Description" value={data.description} onChange={e => setData('description', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.description ? '1px solid red' : '1px solid #ddd' }} />
                            {errors.description && <div style={errorStyle}>{errors.description}</div>}
                        </div>

                        {/* IMAGE */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <input 
                                type="file" 
                                ref={fileInput} 
                                onChange={e => setData('image', e.target.files[0])} 
                                style={{ width: '100%' }} 
                            />
                            {errors.image && <div style={errorStyle}>{errors.image}</div>}
                        </div>

                        <button type="submit" disabled={processing} style={{ gridColumn: 'span 2', background: '#000', color: '#fff', padding: '12px', borderRadius: '6px', cursor: 'pointer', opacity: processing ? 0.6 : 1 }}>
                            {processing ? 'CHARGEMENT...' : 'ENREGISTRER LE LIEU'}
                        </button>
                    </form>
                </div>

                {/* Liste des lieux */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {lieux.map(lieu => (
                        <div key={lieu.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <div style={{ height: '150px', background: '#f4f4f4' }}>
                                {lieu.image && <img src={`/storage/${lieu.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ fontWeight: 'bold' }}>{lieu.ville}, {lieu.pays}</h3>
                                <p style={{ fontSize: '12px', color: '#777' }}>{lieu.adresse}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button onClick={() => router.get(route('admin.lieux.edit', lieu.id))} style={{ flex: 1, padding: '8px', border: '1px solid #C5A059', color: '#C5A059', borderRadius: '6px' }}>MODIFIER</button>
                                    <button onClick={() => confirm('Supprimer ?') && router.delete(route('admin.lieux.destroy', lieu.id))} style={{ flex: 1, padding: '8px', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '6px' }}>SUPPRIMER</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}