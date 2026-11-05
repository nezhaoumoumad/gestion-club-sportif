import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminUsers({ auth, users = [] }) {
    const getInitialTab = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'actif';
    };

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(getInitialTab);

    const goldColor = '#c9a84c';
    const darkColor = '#1a1a1a';

    const changeTab = (tab) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
    };

    const filtered = users.filter(u =>
        (u.prenom + ' ' + u.nom + u.email + (u.telephone || '')).toLowerCase().includes(search.toLowerCase()) &&
        u.category === activeTab
    );

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
            <Head title="Répertoire Elite" />

            <div style={{ padding: '80px 40px', background: '#faf9f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                    {/* ENTÊTE */}
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <p style={{ fontSize: '9px', letterSpacing: '6px', color: goldColor, textTransform: 'uppercase', marginBottom: '15px', fontWeight: '800' }}>Elite Sport Administration</p>
                        <h1 style={{ fontSize: '56px', fontWeight: '200', color: darkColor, margin: '0', fontFamily: "'Playfair Display', serif" }}>Répertoire des Membres</h1>
                        <div style={{ width: '50px', height: '1px', background: goldColor, margin: '30px auto' }}></div>
                    </div>

                    {/* NAVIGATION & RECHERCHE */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <button
                                onClick={() => changeTab('actif')}
                                style={{
                                    ...styles.luxeTab,
                                    color: activeTab === 'actif' ? darkColor : '#bbb',
                                    borderBottom: activeTab === 'actif' ? `2px solid ${goldColor}` : '2px solid transparent'
                                }}
                            >
                                ACTIFS ({users.filter(u => u.category === 'actif').length})
                            </button>
                            <button
                                onClick={() => changeTab('inactif')}
                                style={{
                                    ...styles.luxeTab,
                                    color: activeTab === 'inactif' ? darkColor : '#bbb',
                                    borderBottom: activeTab === 'inactif' ? `2px solid ${goldColor}` : '2px solid transparent'
                                }}
                            >
                                INACTIFS ({users.filter(u => u.category === 'inactif').length})
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                            <div style={{ width: '300px' }}>
                                <input
                                    type="text"
                                    placeholder="Filtrer par nom ou email..."
                                    onChange={e => setSearch(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLEAU */}
                    <div style={styles.tableContainer}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Prénom', 'Nom', 'Email', 'Téléphone', 'Statut', 'Actions'].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? filtered.map(user => (
                                    <tr key={user.id} style={styles.tr}>
                                        <td style={styles.td}>{user.prenom}</td>
                                        <td style={styles.td}><strong>{user.nom}</strong></td>
                                        <td style={{ ...styles.td, color: '#888' }}>{user.email}</td>
                                        <td style={styles.td}>{user.telephone}</td>

                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '900',
                                                    letterSpacing: '1px',
                                                    color: user.category === 'actif' ? '#27ae60' : '#c0392b'
                                                }}>
                                                    {user.category === 'actif' ? 'ACTIF' : 'INACTIF'}
                                                </span>
                                                <span style={{ fontSize: '9px', color: '#aaa', marginTop: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                    {user.sous_texte}
                                                </span>
                                            </div>
                                        </td>

                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <button
                                                    onClick={() => router.get(route('admin.users.show', user.id), { tab: activeTab })}
                                                    style={styles.actionBtn}
                                                >
                                                    Voir
                                                </button>

                                                <button
                                                    onClick={() => router.get(route('admin.users.edit', user.id))}
                                                    style={{...styles.actionBtn, color: goldColor}}
                                                >
                                                    Modifier
                                                </button>

                                                {user.sous_texte === 'Abonnement à jour' && (
                                                    <button
                                                        onClick={() => router.patch(route('admin.users.toggle', user.id))}
                                                        style={{...styles.actionBtn, color: '#e67e22'}}
                                                    >
                                                        Désactiver
                                                    </button>
                                                )}

                                                {user.sous_texte === 'Désactivé par Admin' && (
                                                    <button
                                                        onClick={() => router.patch(route('admin.users.toggle', user.id))}
                                                        style={{...styles.actionBtn, color: '#3498db'}}
                                                    >
                                                        Activer
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => confirm("Supprimer définitivement ?") && router.delete(route('admin.users.destroy', user.id))}
                                                    style={{...styles.actionBtn, color: '#e74c3c'}}
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#ccc' }}>Aucun enregistrement trouvé</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const styles = {
    luxeTab: { background: 'none', border: 'none', padding: '15px 0', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', transition: '0.4s' },
    searchInput: { padding: '12px 0', border: 'none', width: '100%', outline: 'none', fontSize: '13px', background: 'transparent', fontStyle: 'italic', color: '#555', borderBottom: '1px solid #eee' },
    tableContainer: { background: '#fff', borderRadius: '2px', boxShadow: '0 15px 40px rgba(0,0,0,0.01)' },
    th: { padding: '25px 20px', fontSize: '9px', textTransform: 'uppercase', color: '#bbb', letterSpacing: '2px', textAlign: 'left', fontWeight: '800', borderBottom: '1px solid #f5f5f5' },
    td: { padding: '22px 20px', fontSize: '13px', color: '#333' },
    tr: { borderBottom: '1px solid #fcfcfc' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }
};