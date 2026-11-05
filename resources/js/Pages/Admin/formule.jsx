import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Formules({ auth, formules }) {
    const { data, setData, patch, processing, reset } = useForm({
        prix: ''
    });

    const handleUpdate = (e, id) => {
        e.preventDefault();
        patch(route('admin.formules.update', id), {
            onSuccess: () => {
                alert('Prix mis à jour !');
                reset('prix');
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 style={{ fontSize: '14px', fontWeight: 'bold' }}>Gestion des prix</h2>}>
            <Head title="Tarifs Formules" />

            <div style={{ padding: '40px', background: '#fcfbf9', minHeight: '100vh' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    
                    <Link href={route('admin.dashboard')} style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '13px' }}>← Retour au Dashboard</Link>
                    
                    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginBottom: '30px', fontWeight: '300' }}>Modifier les Tarifs</h2>
                        
                        {formules.map((f) => (
                            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f5f5f5' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '18px' }}>{f.nom}</h4>
                                    <p style={{ margin: 0, color: '#c9a84c', fontWeight: 'bold' }}>{f.prix} DH / mois</p>
                                </div>

                                <form onSubmit={(e) => handleUpdate(e, f.id)} style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="number" 
                                        placeholder="Nouveau prix"
                                        onChange={e => setData('prix', e.target.value)}
                                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', width: '130px' }}
                                        required
                                    />
                                    <button 
                                        disabled={processing} 
                                        style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Valider
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}