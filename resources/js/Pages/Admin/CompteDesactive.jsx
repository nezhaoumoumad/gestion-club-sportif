import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CompteDesactive() {
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#faf9f6',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            <Head title="Compte Coach Désactivé" />

            {/* Logo */}
            <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px', color: '#111' }}>
                    ELITE<span style={{ color: '#c9a84c' }}>SPORT</span>
                </span>
            </div>
            
            <div style={{ 
                maxWidth: '520px', 
                width: '100%', 
                background: '#fff', 
                padding: '50px 45px', 
                borderRadius: '8px',
                borderTop: '3px solid #c9a84c',
                boxShadow: '0 4px 30px rgba(0,0,0,0.06)',
                textAlign: 'center'
            }}>
                {/* Icône d'alerte */}
                <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#fff8f0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 28px'
                }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                
                <h1 style={{ 
                    fontSize: '22px', fontWeight: '300', color: '#111', 
                    marginBottom: '12px', letterSpacing: '-0.3px'
                }}>
                    Accès au Dashboard Coach suspendu
                </h1>

                <div style={{ width: '30px', height: '1px', background: '#c9a84c', margin: '0 auto 24px' }}></div>
                
                <p style={{ 
                    fontSize: '14px', lineHeight: '1.8', color: '#666', marginBottom: '16px'
                }}>
                    L'administration du club a temporairement désactivé votre profil coach. 
                    De ce fait, votre accès aux outils de gestion et vos réservations est restreint.
                </p>

                <p style={{ 
                    fontSize: '13px', lineHeight: '1.7', color: '#999', marginBottom: '36px'
                }}>
                    Si vous pensez qu'il s'agit d'une erreur, nous vous invitons à contacter 
                    le responsable de l'administration pour régulariser votre situation.
                </p>
                
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '28px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Retour à l'accueil public */}
                    <Link 
                        href="/"
                        style={{ 
                            fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', 
                            fontWeight: '700', color: '#fff', background: '#c9a84c',
                            padding: '12px 24px', borderRadius: '4px', textDecoration: 'none',
                            display: 'inline-block'
                        }}
                    >
                        Retour au site
                    </Link>

                    {/* Déconnexion pour changer de compte si besoin */}
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        style={{ 
                            fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', 
                            fontWeight: '700', color: '#aaa', background: 'none',
                            border: '1px solid #e0e0e0', padding: '12px 24px',
                            borderRadius: '4px', cursor: 'pointer'
                        }}
                    >
                        Se déconnecter
                    </Link>
                </div>
            </div>
        </div>
    );
}