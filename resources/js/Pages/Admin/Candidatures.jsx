import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminCandidatures({ auth, candidatures = [] }) {
    const { patch, processing } = useForm();
    const [activeTab, setActiveTab] = useState('en_attente');

    const goldColor = '#c9a84c';

    const accepter = (id) => patch(route('admin.candidatures.accepter', id));
    const refuser = (id) => patch(route('admin.candidatures.refuser', id));

    const safeCandidatures = Array.isArray(candidatures) ? candidatures : [];

    const stats = {
        en_attente: safeCandidatures.filter(c => c.statut === 'en_attente').length,
        acceptee: safeCandidatures.filter(c => c.statut === 'acceptee').length,
        refusee: safeCandidatures.filter(c => c.statut === 'refusee').length,
    };

    const filteredCandidatures = safeCandidatures.filter(c => c.statut === activeTab);

    const tabStyle = (isActive) => ({
        padding: '15px 30px',
        cursor: 'pointer',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        borderBottom: isActive ? `2px solid ${goldColor}` : '2px solid transparent',
        color: isActive ? '#111' : '#aaa',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.3s ease'
    });

    const labelTitleStyle = {
        fontSize: '10px',
        textTransform: 'uppercase',
        color: goldColor,
        letterSpacing: '1px',
        marginBottom: '8px',
        fontWeight: 'bold'
    };

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
            <Head title="Administration Candidatures" />
            
            <div style={{ padding: '48px', background: '#f8f7f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    
                    <div style={{ marginBottom: '48px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '4px', color: goldColor, textTransform: 'uppercase', marginBottom: '8px' }}>Recrutement</p>
                        <h1 style={{ fontSize: '36px', fontWeight: '300', color: '#111', margin: 0 }}>Candidatures Coaches</h1>
                    </div>

                    {/* ONGLETS */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', marginBottom: '40px' }}>
                        <div onClick={() => setActiveTab('en_attente')} style={tabStyle(activeTab === 'en_attente')}>
                            À traiter ({stats.en_attente})
                        </div>
                        <div onClick={() => setActiveTab('acceptee')} style={tabStyle(activeTab === 'acceptee')}>
                            Coaches ({stats.acceptee})
                        </div>
                        <div onClick={() => setActiveTab('refusee')} style={tabStyle(activeTab === 'refusee')}>
                            Refusées ({stats.refusee})
                        </div>
                    </div>

                    {/* LISTE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {filteredCandidatures.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>Aucune candidature trouvée.</p>
                        ) : (
                            filteredCandidatures.map((c) => (
                                <div key={c.id} style={{ background: '#fff', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative' }}>
                                    
                                    <div style={{ position: 'absolute', top: '40px', right: '40px', padding: '6px 12px', background: '#f8f8f8', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888' }}>
                                        {c.statut.replace('_', ' ')}
                                    </div>

                                    <div style={{ marginBottom: '35px' }}>
                                        <h3 style={{ fontSize: '24px', fontWeight: '400', color: '#111', marginBottom: '5px' }}>
                                            {c.user?.prenom} {c.user?.nom}
                                        </h3>
                                        <p style={{ color: goldColor, fontSize: '13px', letterSpacing: '1px' }}>{c.user?.email}</p>
                                    </div>
                                    
                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '30px' }}>
                                        <div style={{ marginBottom: '35px' }}>
                                            <p style={labelTitleStyle}>Motivation</p>
                                            <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                                {c.motivation || "Aucune motivation renseignée."}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '35px' }}>
                                            <p style={labelTitleStyle}>Expérience Professionnelle</p>
                                            <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                                {c.experience || "Aucune expérience renseignée."}
                                            </p>
                                        </div>

                                        {c.cv_path && (
                                            <div style={{ marginBottom: '10px' }}>
                                                <p style={labelTitleStyle}>Dossier de candidature</p>
                                                <a 
                                                    href={`/storage/${c.cv_path}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '15px',
                                                        padding: '15px 25px', border: '1px solid #111',
                                                        color: '#111', textDecoration: 'none', fontSize: '11px',
                                                        letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold'
                                                    }}
                                                >
                                                    <span>📄</span> Consulter le CV
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {activeTab === 'en_attente' && (
                                        <div style={{ display: 'flex', gap: '20px', marginTop: '40px', borderTop: '1px solid #f0f0f0', paddingTop: '30px' }}>
                                            <button 
                                                onClick={() => accepter(c.id)} 
                                                disabled={processing} 
                                                style={{ background: '#111', color: '#fff', border: 'none', padding: '15px 40px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Accepter
                                            </button>
                                            <button 
                                                onClick={() => refuser(c.id)} 
                                                disabled={processing} 
                                                style={{ background: 'transparent', color: '#999', border: '1px solid #eee', padding: '15px 40px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}