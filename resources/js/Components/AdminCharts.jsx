import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

const AdminCharts = ({ statsRoles, statsRecettes, statsInscriptions }) => {
    const COLORS = ['#c9a84c', '#1a1a1a']; // Or et Noir/Gris foncé
    const lightGold = '#dfc680';

    return (
        <div className="py-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. SECTEUR : COACHS VS CLIENTS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6 text-center">Répartition par Rôle</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statsRoles}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statsRoles.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. COURBE : ÉVOLUTION DES INSCRIPTIONS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6 text-center">Nouveaux Membres</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={statsInscriptions}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="mois" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="nouveaux" stroke="#c9a84c" strokeWidth={3} dot={{ r: 5, fill: '#c9a84c' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. HISTOGRAMME : COMPARAISON RECETTES (Largeur Totale) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6 text-center">Comparatif Recettes Mensuelles (DH)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statsRecettes}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="mois" axisLine={false} tickLine={false} fontSize={12} />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} />
                            <Tooltip cursor={{ fill: '#f8f4e9' }} />
                            <Bar dataKey="total" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminCharts;