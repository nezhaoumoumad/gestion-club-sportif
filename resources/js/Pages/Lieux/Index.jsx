import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function LieuxIndex({ lieux, auth }) {
    const goldColor = '#c9a84c';
    const bgDark = '#000000';
    const [searchQuery, setSearchQuery] = useState('');
    const { __, isRTL } = useTranslation();

    const filteredLieux = lieux.filter(lieu =>
        lieu.ville.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Nos Clubs - Elite Sport" />
            <div style={{ minHeight: '100vh', background: bgDark, color: '#fff', fontFamily: "'Inter', sans-serif" }}
                dir={isRTL ? 'rtl' : 'ltr'}>

                {/* NAVIGATION NOIRE */}
                <nav style={{ padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', height: '80px', borderBottom: '1px solid #111' }}>
                    <Link href="/" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#fff', textDecoration: 'none', textTransform: 'uppercase' }}>
                        ELITE<span style={{ color: goldColor }}>SPORT</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <Link href="/lieux"   style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: `1px solid ${goldColor}`, paddingBottom: '5px' }}>{__('nav_clubs')}</Link>
                        <Link href="/sports"  style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_sports')}</Link>
                        <Link href="/membership" style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_membership')}</Link>
                        <Link href="/personal-training" style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_private')}</Link>
                        <Link href={route('candidature.create')} style={{ textDecoration: 'none', color: goldColor, fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('nav_coach')}</Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/*  SWITCHER */}
                        <LanguageSwitcher theme="dark" />

                        {!auth?.user ? (
                            <>
                                <Link href="/login"    style={{ textDecoration: 'none', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('login')}</Link>
                                <Link href="/register" style={{ textDecoration: 'none', background: '#fff', color: '#000', padding: '12px 30px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('join')}</Link>
                            </>
                        ) : (
                            <Link href="/dashboard" style={{ textDecoration: 'none', background: '#fff', color: '#000', padding: '12px 30px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{__('my_space')}</Link>
                        )}
                    </div>
                </nav>

                <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '64px', fontWeight: '700', color: '#fff', lineHeight: '1.1', textTransform: 'uppercase' }}>
                            {lieux.length} {__('clubs_in_morocco')}
                        </h1>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '80px', display: 'flex', border: '1px solid #333' }}>
                        <input
                            type="text"
                            placeholder={__('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', padding: '25px', color: '#fff', fontSize: '16px', outline: 'none', direction: isRTL ? 'rtl' : 'ltr' }}
                        />
                        <button style={{ background: '#fff', color: '#000', border: 'none', padding: '0 40px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer' }}>
                            {__('search_btn')}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredLieux.map((lieu) => (
                            <LieuCard key={lieu.id} lieu={lieu} goldColor={goldColor} viewPlanningLabel={__('view_planning')} noImageLabel={__('no_image')} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function LieuCard({ lieu, goldColor, viewPlanningLabel, noImageLabel }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ height: '450px', position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#eee', boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.05)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
        >
            {lieu.image ? (
                <img src={`/storage/${lieu.image}`} alt={lieu.ville} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.6s ease' }} />
            ) : (
                <div style={{ width: '100%', height: '100%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{noImageLabel}</div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: isHovered ? 'rgba(0,0,0,0.2)' : 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', transition: 'all 0.3s ease' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: isHovered ? 'translateY(-80px)' : 'translateY(0)', transition: 'all 0.5s ease' }}>
                <span style={{ color: goldColor, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '5px' }}>{lieu.pays}</span>
                <h3 style={{ color: '#fff', fontSize: '32px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center' }}>{lieu.ville}</h3>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '35px 25px', transform: isHovered ? 'translateY(0)' : 'translateY(100%)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center' }}>
                <h4 style={{ color: goldColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>Informations</h4>
                <p style={{ color: '#111', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>{lieu.adresse}</p>
                {lieu.telephone && <p style={{ color: '#777', fontSize: '13px', marginBottom: '15px' }}>Tél : {lieu.telephone}</p>}
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>{lieu.description}</p>
                <Link href={route('formules.index')} style={{ display: 'inline-block', padding: '10px 20px', background: goldColor, color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px' }}>
                    {viewPlanningLabel}
                </Link>
            </div>
        </div>
    );
}