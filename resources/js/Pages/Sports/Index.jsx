import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function SportsIndex({ sports, auth }) {
    const goldColor = '#c9a84c';
    const { __, isRTL } = useTranslation();

    return (
        <>
            <Head title="Nos Disciplines - Elite Sport" />
            
            <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif" }}
                dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* 1. NAVIGATION */}
                <nav style={{ 
                    padding: '0 48px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#000', 
                    height: '80px',
                    borderBottom: '1px solid #111',
                    position: 'relative',
                    zIndex: 1000
                }}>
                    <Link href="/" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#fff', textDecoration: 'none', textTransform: 'uppercase' }}>
                        ELITE<span style={{ color: goldColor }}>SPORT</span>
                    </Link>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <Link href="/lieux"   style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_clubs')}</Link>
                        <Link href="/sports"  style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: `1px solid ${goldColor}`, paddingBottom: '5px' }}>{__('nav_sports')}</Link>
                        <Link href="/membership" style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_membership')}</Link>
                        <Link href="/personal-training" style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_private')}</Link>
                        <Link href={route('candidature.create')} style={{ textDecoration: 'none', color: goldColor, fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_coach')}</Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* 🌐 SWITCHER */}
                        <LanguageSwitcher theme="dark" />

                        {auth?.user ? (
                            <Link href="/dashboard" style={{ textDecoration: 'none', background: '#fff', color: '#000', padding: '12px 30px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                {__('my_space')}
                            </Link>
                        ) : (
                            <>
                                <Link href="/login"    style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('login')}</Link>
                                <Link href="/register" style={{ textDecoration: 'none', background: '#fff', color: '#000', padding: '12px 30px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('join')}</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* 2. SECTION HERO */}
                <div style={{ 
                    height: '100vh', 
                    width: '100%', 
                    position: 'relative', 
                    backgroundImage: 'url("/images/grand_sport.jpg")', 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 80px'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                        <h1 style={{ fontSize: '55px', fontWeight: '800', lineHeight: '1.1', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '-1px' }}>
                            {__('sports_hero_title')}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '35px', maxWidth: '600px' }}>
                            {__('sports_hero_desc')}
                        </p>
                        <Link href="/register" style={{ background: '#fff', color: '#000', padding: '15px 40px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {__('join_club')}
                        </Link>
                    </div>
                </div>

                {/* 3. GRILLE DES SPORTS */}
                <div style={{ padding: '60px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{__('our_sports')}</h2>
                        <div style={{ width: '50px', height: '3px', background: goldColor, marginTop: '15px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                        {sports.map((sport) => (
                            <SportCard key={sport.id} sport={sport} goldColor={goldColor} aboutLabel={__('about_sport')} discoverLabel={__('discover_offers')} />
                        ))}
                    </div>
                </div>

                {/* 4. SECTION BAS */}
                <div style={{ padding: '80px 80px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center', gap: '60px', background: '#050505' }}>
                    <div>
                        <h2 style={{ fontSize: '50px', fontWeight: '900', lineHeight: '1', textTransform: 'uppercase', marginBottom: '25px' }}>
                            {__('unlimited_classes')}
                        </h2>
                        <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '550px' }}>
                            {__('unlimited_desc')}
                        </p>
                        <Link href="/register" style={{ border: '1px solid #fff', color: '#fff', padding: '14px 35px', textDecoration: 'none', fontWeight: '800', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {__('join_club')}
                        </Link>
                    </div>
                    <div style={{ height: '500px', background: '#111' }}>
                        <img src="/images/petit_sport.jpg" alt="Elite Sport Transformation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </div>
        </>
    );
}

function SportCard({ sport, goldColor, aboutLabel, discoverLabel }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ height: '450px', position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#111', transition: 'all 0.4s ease', cursor: 'pointer' }}
        >
            {sport.image ? (
                <img src={`/storage/${sport.image}`} alt={sport.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.6s ease' }} />
            ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Image</div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: isHovered ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isHovered ? 'translateY(-80px)' : 'translateY(0)', transition: 'all 0.5s ease' }}>
                <h3 style={{ color: '#fff', fontSize: '26px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase' }}>{sport.nom}</h3>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '35px 25px', transform: isHovered ? 'translateY(0)' : 'translateY(100%)', transition: 'all 0.4s ease', textAlign: 'center' }}>
                <h4 style={{ color: goldColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px' }}>{aboutLabel}</h4>
                <p style={{ color: '#111', fontSize: '14px', marginBottom: '20px' }}>{sport.description}</p>
                <Link href={route('formules.index')} style={{ display: 'inline-block', padding: '10px 20px', background: goldColor, color: '#fff', fontSize: '10px', fontWeight: '700', textDecoration: 'none' }}>{discoverLabel}</Link>
            </div>
        </div>
    ); 
}