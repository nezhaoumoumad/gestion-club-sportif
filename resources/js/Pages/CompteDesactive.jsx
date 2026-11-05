import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CompteDesactive() {
    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#faf9f6',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            <Head title="Compte Désactivé" />
            
            <div style={{ 
                maxWidth: '500px', 
                width: '100%', 
                background: '#fff', 
                padding: '40px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
                
                <h1 style={{ 
                    fontSize: '24px', 
                    fontWeight: '300', 
                    color: '#111', 
                    marginBottom: '20px',
                    letterSpacing: '-0.5px'
                }}>
                    Accès Restreint
                </h1>
                
                <p style={{ 
                    fontSize: '15px', 
                    lineHeight: '1.6', 
                    color: '#666', 
                    marginBottom: '30px' 
                }}>
                    Votre accès à l'espace membre est actuellement suspendu. 
                    Cette situation peut être due à une désactivation administrative ou à l'absence d'un abonnement valide.
                </p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
                        Pour toute information complémentaire ou pour régulariser votre situation, 
                        nous vous invitons à contacter directement l'accueil de votre club.
                    </p>
                    
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        style={{ 
                            fontSize: '11px', 
                            letterSpacing: '2px', 
                            textTransform: 'uppercase', 
                            fontWeight: '700', 
                            color: '#c9a84c',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Se déconnecter
                    </Link>
                </div>
            </div>
        </div>
    );
}