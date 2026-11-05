import { Head, Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function PersonalTraining({ auth }) {
    const { __, isRTL } = useTranslation();

    return (
        <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Entraînement Personnel | ELITE SPORT" />

            {/* 1. NAVIGATION */}
            <nav className="bg-black h-20 px-6 md:px-12 flex justify-between items-center z-[100] relative border-b border-white/10 w-full">
                <Link href="/" className="text-xl font-black tracking-[0.3em] uppercase hover:opacity-80 transition-opacity">
                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                </Link>
                <div className="hidden lg:flex items-center gap-10">
                    <Link href={route('lieux.index')}             className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_clubs')}</Link>
                    <Link href={route('sports.index')}            className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_sports')}</Link>
                    <Link href={route('formules.index')}          className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_membership')}</Link>
                    <Link href={route('personal-training.index')} className="text-[10px] tracking-[0.2em] uppercase font-bold text-white transition-colors border-b border-[#c9a84c]">{__('nav_private')}</Link>
                    <Link href={route('candidature.create')}      className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c9a84c] hover:opacity-80 transition-all">{__('nav_coach')}</Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* 🌐 SWITCHER */}
                    <LanguageSwitcher theme="dark" />
                    {!auth?.user ? (
                        <>
                            <Link href={route('login')}    className="text-[10px] tracking-[0.2em] font-bold uppercase text-white">{__('login')}</Link>
                            <Link href={route('register')} className="bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] hover:text-white transition-all">{__('join')}</Link>
                        </>
                    ) : (
                        <Link href={route('dashboard')} className="bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] hover:text-white transition-all">
                            {__('my_space')}
                        </Link>
                    )}
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <div className="relative h-screen w-full overflow-hidden">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src="/videos/personal-training-hero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex flex-col items-start justify-center p-12 md:p-24 bg-black/40">
                    <div className="max-w-2xl"> 
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic text-left leading-tight text-white">
                            {__('pt_hero_title')}
                        </h1>
                        <p className="text-lg md:text-xl font-light tracking-wide text-white/90 text-left">
                            {__('pt_hero_desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. SECTION CARACTÉRISTIQUES */}
            <div className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="text-left">
                        <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter text-white">
                            {__('pt_power_title')}
                        </h2>
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-light text-gray-300 leading-relaxed mb-8">
                            {__('pt_power_desc1')}
                        </p>
                        <p className="text-lg font-light text-gray-300 leading-relaxed">
                            {__('pt_power_desc2')}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. SECTION 1:1 COACHING */}
            <div className="py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <h2 className="text-5xl font-black uppercase leading-tight tracking-tighter text-white mb-8">
                            {__('pt_plan_title')}
                        </h2>
                        <p className="text-gray-300 text-lg font-light leading-relaxed mb-10">
                            {__('pt_plan_desc')}
                        </p>
                        <Link 
                            href={auth?.user ? route('reservations.coaching.index') : route('register')} 
                            className="inline-block border border-[#c9a84c] text-[#c9a84c] font-bold text-[11px] uppercase tracking-[0.3em] px-12 py-5 hover:bg-[#c9a84c] hover:text-black transition-all"
                        >
                            {__('pt_book_cta')}
                        </Link>
                    </div>
                    <div className="w-full h-[600px] overflow-hidden">
                        <img src="/images/coach-1-1.jpg" alt="Elite Coaching Session" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <footer className="py-20 text-center border-t border-white/5 w-full bg-black">
                <div className="text-xl font-black tracking-[0.4em] uppercase mb-4">
                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                </div>
                <p className="text-[10px] tracking-[3px] text-gray-600 uppercase">{__('footer_rights')}</p>
            </footer>
        </div>
    );
}