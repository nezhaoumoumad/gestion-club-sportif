import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Logs({ logs }) {
    return (
        <div className="p-6">
            <Head title="Archives de suppression" />
            <h2 className="text-xl font-bold mb-4">Historique des suppressions (Archives)</h2>
            
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 border-b text-left">ID Origine</th>
                        <th className="p-3 border-b text-left">Nom</th>
                        <th className="p-3 border-b text-left">Email</th>
                        <th className="p-3 border-b text-left">Ancien Rôle</th>
                        <th className="p-3 border-b text-left">Supprimé le</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="p-3 border-b">#{log.user_id}</td>
                            <td className="p-3 border-b font-medium">{log.nom}</td>
                            <td className="p-3 border-b">{log.email}</td>
                            <td className="p-3 border-b">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                    {log.role_au_moment_suppression}
                                </span>
                            </td>
                            <td className="p-3 border-b">
                                {new Date(log.date_suppression).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {logs.length === 0 && (
                <p className="p-4 text-gray-500 text-center">Aucun utilisateur supprimé pour le moment.</p>
            )}
        </div>
    );
}