import { usePage } from '@inertiajs/react';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English'  },
    { code: 'ar', label: 'AR', flag: '🇲🇦', name: 'العربية'  },
];

export default function LanguageSwitcher({ theme = 'light' }) {
    const { locale = 'fr' } = usePage().props;
    const [open, setOpen] = useState(false);

    const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

    const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(201,168,76,0.35)';
    const borderHover = theme === 'dark' ? 'rgba(255,255,255,0.6)'  : '#c9a84c';
    const labelColor  = '#c9a84c';

    // ── FIX CRITIQUE : window.location.href force un vrai rechargement de page
    // router.get() d'Inertia interceptait la redirection et ne rechargait pas la session
    const switchTo = (code) => {
        setOpen(false);
        if (code === locale) return;
        window.location.href = route('language.switch', { locale: code });
    };

    return (
        <div style={{ position: 'relative', fontFamily: "'Inter', sans-serif", zIndex: 200 }}>

            {/* ── BOUTON PRINCIPAL ── */}
            <button
                onClick={() => setOpen(!open)}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = borderHover)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = borderColor)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'transparent',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '2px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                }}
            >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{current.flag}</span>
                <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.2em', color: labelColor, textTransform: 'uppercase' }}>
                    {current.label}
                </span>
                <svg
                    style={{
                        width: '9px', height: '9px', color: labelColor,
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* ── OVERLAY pour fermer ── */}
            {open && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 198 }} onClick={() => setOpen(false)} />
            )}

            {/* ── DROPDOWN ── */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', border: '1px solid rgba(201,168,76,0.2)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    minWidth: '145px', borderRadius: '2px', overflow: 'hidden',
                    zIndex: 199,
                }}>
                    {LANGUAGES.map((lang) => {
                        const isActive = lang.code === locale;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => switchTo(lang.code)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                                        e.currentTarget.style.borderLeftColor = 'rgba(201,168,76,0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderLeftColor = 'transparent';
                                    }
                                }}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 14px',
                                    background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                    borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                                <div>
                                    <div style={{
                                        fontSize: '9px', fontWeight: '800', letterSpacing: '0.2em',
                                        color: isActive ? '#c9a84c' : '#111', textTransform: 'uppercase',
                                    }}>
                                        {lang.label}
                                    </div>
                                    <div style={{
                                        fontSize: '10px', color: '#999', marginTop: '1px',
                                        direction: lang.code === 'ar' ? 'rtl' : 'ltr',
                                    }}>
                                        {lang.name}
                                    </div>
                                </div>
                                {isActive && (
                                    <svg style={{ width: '10px', height: '10px', color: '#c9a84c', marginLeft: 'auto' }}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}