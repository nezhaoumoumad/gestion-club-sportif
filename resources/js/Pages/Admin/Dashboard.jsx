import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

const StatCard = ({ value, label }) => (
    <div style={{ 
        background: '#fff', 
        padding: '25px', 
        borderLeft: '4px solid #c9a84c', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        borderRadius: '4px'
    }}>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', marginBottom: '5px' }}>{value}</p>
        <p style={{ fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888', fontWeight: '600' }}>{label}</p>
    </div>
);

export default function AdminDashboard({ auth, stats, statsRoles, statsRecettes, statsInscriptions }) {
    const goldColor = '#c9a84c';
    const COLORS = ['#c9a84c', '#111'];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Espace Administration" />

            <div style={{ padding: '60px 40px', background: '#fcfbf9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* --- TITRE ET ENTÊTE --- */}
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '38px', fontWeight: '200', color: '#111', margin: '0' }}>Gestion du Club</h1>
                        <p style={{ fontSize: '14px', color: '#888', marginTop: '15px', maxWidth: '600px', margin: '15px auto 0', lineHeight: '1.6' }}>
                            Bienvenue sur votre interface de gestion. Suivez vos indicateurs en temps réel et pilotez les différents modules de votre établissement.
                        </p>
                        <div style={{ width: '30px', height: '1px', background: goldColor, margin: '25px auto' }}></div>
                    </div>

                    {/* --- CARTES DE STATISTIQUES --- */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <StatCard value={stats.total_membres} label="Membres" />
                        <StatCard value={stats.equipe_coachs} label="Coachs" />
                        <StatCard value={stats.seances_planning} label="Séances" />
                        <StatCard value={stats.abonnes_actifs} label="Actifs" />
                        <StatCard value={stats.total_villes} label="Villes" />
                        <StatCard value={stats.total_sports} label="Sports" />
                        <StatCard value={`${stats.chiffre_affaires} DH`} label="Recettes" />
                    </div>

                    {/* --- GRAPHIQUES --- */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                        
                        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                            <h3 style={{ fontSize: '10px', letterSpacing: '1px', color: '#888', marginBottom: '20px', fontWeight: 'bold' }}>COMPARAISON RECETTES MENSUELLES</h3>
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <BarChart data={statsRecettes}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9f9f9" />
                                        <XAxis dataKey="mois" axisLine={false} tickLine={false} fontSize={11} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={11} />
                                        <Tooltip cursor={{fill: '#fcfbf9'}} />
                                        <Bar dataKey="total" fill={goldColor} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                            <h3 style={{ fontSize: '10px', letterSpacing: '1px', color: '#888', marginBottom: '20px', fontWeight: 'bold' }}>RÉPARTITION COACHS VS CLIENTS</h3>
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={statsRoles} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {statsRoles.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #f0f0f0', gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '10px', letterSpacing: '1px', color: '#888', marginBottom: '20px', fontWeight: 'bold' }}>ÉVOLUTION DES INSCRIPTIONS</h3>
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <LineChart data={statsInscriptions}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9f9f9" />
                                        <XAxis dataKey="mois" axisLine={false} tickLine={false} fontSize={11} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={11} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="nouveaux" stroke={goldColor} strokeWidth={2} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* --- BOUTONS DE NAVIGATION --- */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        {[
                            { href: route('admin.users'), title: 'Membres', desc: 'Gestion des profils et abonnements' },
                            { href: route('admin.candidatures'), title: 'Recrutement', desc: 'Gestion des candidatures coachs' },
                            { href: route('admin.seances.index'), title: 'Planning', desc: 'Calendrier et cours sportifs' },
                            { href: route('admin.sports.index'), title: 'Disciplines', desc: 'Gérer les activités (Ajouter, Modifier, Supprimer)' },
                            { href: route('admin.lieux.index'), title: 'Villes & Salles', desc: 'Emplacements géographiques' },
                            { href: route('admin.paiements'), title: 'Paiements Actifs', desc: 'Flux de trésorerie — membres actifs' },
                            { href: route('admin.coachs.index'), title: 'Coachs', desc: 'Gestion des profils et disponibilités' },
                            { href: route('admin.logs.index'), title: 'Archives', desc: 'Historique des comptes supprimés (Trigger)' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', background: '#fff',
                                    padding: '20px', borderRadius: '8px', textDecoration: 'none',
                                    color: '#111', border: '1px solid #f0f0f0', transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = goldColor}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            >
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: goldColor, marginRight: '15px' }}></div>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.title}</h4>
                                    <p style={{ fontSize: '11px', color: '#aaa', margin: '2px 0 0 0' }}>{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* --- SECTION EXPORT XML --- */}
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                        <h3 style={{ fontSize: '12px', letterSpacing: '1px', color: '#888', marginBottom: '20px', fontWeight: 'bold' }}>EXPORTER LES DONNÉES (XML)</h3>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <a href="/admin/export/membres" className="export-btn">Membres (.xml)</a>
                            <a href="/admin/export/coachs" className="export-btn">Coachs (.xml)</a>
                            <a href="/admin/export/paiements" className="export-btn">Paiements (.xml)</a>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- STYLE DES BOUTONS --- */}
            <style>{`
                .export-btn {
                    padding: 10px 20px;
                    background: #fcfbf9;
                    border: 1px solid #c9a84c;
                    color: #c9a84c;
                    border-radius: 4px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .export-btn:hover {
                    background: #c9a84c;
                    color: #fff;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}