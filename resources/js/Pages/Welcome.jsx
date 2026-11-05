import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const { __, isRTL } = useTranslation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const SectionEquinox = ({ titreKey, descKey, lienKey, hrefLien, imageSrc, videoSrc, inverse = false }) => (
        <section className={`relative h-[110vh] w-full overflow-hidden flex items-center ${inverse ? 'justify-end' : 'justify-start'} px-0 md:px-32`}>
            <div className="absolute inset-0 z-0">
                {videoSrc ? (
                    <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                ) : (
                    <img src={imageSrc} className="h-full w-full object-cover" alt={__(titreKey)} />
                )}
            </div>
            <div className="relative z-20 bg-white p-8 md:p-12 max-w-sm shadow-2xl mx-6 md:mx-0" dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl md:text-4xl font-light tracking-tighter text-black mb-6 uppercase leading-tight">
                    {__(titreKey)}
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-8 leading-relaxed font-light">
                    {__(descKey)}a
                </p>
                <Link href={hrefLien}
                    className="inline-block text-black font-bold text-[10px] uppercase tracking-[0.3em] border-b-2 border-black pb-2 hover:text-[#c9a84c] hover:border-[#c9a84c] transition-all">
                    {__(lienKey)}
                </Link>
            </div>
        </section>
    );

    return (
        <>
            <Head title="ELITE SPORT | Fitness de Luxe" />
            <div className="bg-white text-black font-sans" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* NAVIGATION */}
                <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 h-20 flex justify-between items-center ${
                    scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-transparent'
                }`}>
                    <div className={`text-xl font-black tracking-[0.3em] uppercase transition-colors ${scrolled ? 'text-black' : 'text-white'}`}>
                        ELITE<span className="text-[#c9a84c]">SPORT</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        {[
                            { key: 'nav_clubs',      href: route('lieux.index') },
                            { key: 'nav_sports',     href: route('sports.index') },
                            { key: 'nav_membership', href: route('formules.index') },
                            { key: 'nav_private',    href: route('personal-training.index') },
                        ].map(({ key, href }) => (
                            <Link key={key} href={href}
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                                    scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'
                                }`}>
                                {__(key)}
                            </Link>
                        ))}
                        <Link href={route('candidature.create')}
                            className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c9a84c] border-b border-[#c9a84c]/0 hover:border-[#c9a84c] transition-all">
                            {__('nav_coach')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 🌐 SWITCHER — theme adaptatif selon scroll */}
                        <LanguageSwitcher theme={scrolled ? 'light' : 'dark'} />

                        {!auth?.user ? (
                            <>
                                <Link href={route('login')}
                                    className={`text-[10px] tracking-[0.2em] font-bold uppercase ${scrolled ? 'text-black' : 'text-white'}`}>
                                    {__('login')}
                                </Link>
                                <Link href={route('register')}
                                    className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] transition-all">
                                    {__('join')}
                                </Link>
                            </>
                        ) : (
                            <Link href={route('dashboard')}
                                className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] transition-all">
                                {__('my_space')}
                            </Link>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <section className="relative h-[110vh] w-full overflow-hidden flex items-center px-8 md:px-20">
                    <div className="absolute inset-0 z-0">
                        <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                            <source src="/videos/hero-fitness.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                    <div className="relative z-20 text-white max-w-4xl">
                        <h1 className="text-6xl md:text-8xl font-light leading-[1.1] tracking-tighter mb-10 uppercase">
                            {__('hero_line1')}<br />
                            {__('hero_line2')}<br />
                            <span className="font-serif italic text-[#c9a84c]">{__('hero_line3')}</span>
                        </h1>
                        <Link href={route('register')}
                            className="inline-block text-white font-bold text-xs uppercase tracking-[0.3em] border-b-2 border-white pb-3 hover:text-[#c9a84c] hover:border-[#c9a84c] transition-all">
                            {__('hero_cta')}
                        </Link>
                    </div>
                </section>

                {/* SECTIONS */}
                <SectionEquinox titreKey="section_clubs_title"  descKey="section_clubs_desc"  lienKey="section_clubs_link"  hrefLien={route('lieux.index')}            imageSrc="/images/lieux.jpg"      inverse={true}  />
                <SectionEquinox titreKey="section_sports_title" descKey="section_sports_desc" lienKey="section_sports_link" hrefLien={route('sports.index')}           imageSrc="/images/sports.jpg"     inverse={false} />
                <SectionEquinox titreKey="section_pt_title"     descKey="section_pt_desc"     lienKey="section_pt_link"     hrefLien={route('personal-training.index')} imageSrc="/images/coach.jpg"      inverse={true}  />
                <SectionEquinox titreKey="section_abo_title"    descKey="section_abo_desc"    lienKey="section_abo_link"    hrefLien={route('formules.index')}          imageSrc="/images/membership.jpg" inverse={false} />

                <footer className="bg-white border-t border-gray-100 py-20 px-10 text-center">
                    <div className="text-xl font-black tracking-[0.4em] uppercase mb-6">
                        ELITE<span className="text-[#c9a84c]">SPORT</span>
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">{__('footer_rights')}</p>
                </footer>
            </div>
        </>
    );
}