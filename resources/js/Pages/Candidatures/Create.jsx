import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function CandidatureCreate({ auth, candidatureActuelle }) {
    const goldColor = '#c9a84c';
    const { __, isRTL } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        experience: '',
        motivation: '',
        cv: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('candidature.store'), {
            onSuccess: () => reset(), 
        });
    };

    const isEnAttente = candidatureActuelle && candidatureActuelle.statut === 'en_attente';
    const isAcceptee  = candidatureActuelle && candidatureActuelle.statut === 'acceptee';

    const inputStyle = (hasError) => ({
        width: '100%',
        border: hasError ? '1px solid #c00' : '1px solid #eee',
        padding: '15px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fff',
    });

    const labelStyle = {
        display: 'block',
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#888',
        marginBottom: '8px',
        fontWeight: '700'
    };

    return (
        <div className="bg-black min-h-screen text-white font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Devenir Coach | ELITE SPORT" />

            {/* NAVIGATION */}
            <nav className="bg-black h-20 px-6 md:px-12 flex justify-between items-center z-[100] relative border-b border-white/10 w-full">
                <Link href="/" className="text-xl font-black tracking-[0.3em] uppercase hover:opacity-80 transition-opacity">
                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                </Link>
                <div className="hidden lg:flex items-center gap-10">
                    <Link href={route('lieux.index')}             className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_clubs')}</Link>
                    <Link href={route('sports.index')}            className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_sports')}</Link>
                    <Link href={route('formules.index')}          className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_membership')}</Link>
                    <Link href={route('personal-training.index')} className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_private')}</Link>
                    <Link href={route('candidature.create')}      className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c9a84c] transition-all border-b border-[#c9a84c] pb-1">{__('nav_coach')}</Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* 🌐 SWITCHER */}
                    <LanguageSwitcher theme="dark" />
                    <Link href={route('dashboard')} className="bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] hover:text-white transition-all">
                        {__('my_space')}
                    </Link>
                </div>
            </nav>

            {/* CONTENU PRINCIPAL */}
            <div className="py-10 bg-[#fdfdfd] min-h-[calc(100vh-80px)]">
                <div className="max-w-3xl mx-auto px-6">

                    <div className="mb-8 text-center">
                        <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-2 font-bold">
                            {__('career_label')}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-light text-black tracking-tighter uppercase italic">
                            {__('join_elite')}
                        </h1>
                        <div className="w-8 h-[1px] bg-[#c9a84c] mx-auto mt-4"></div>
                    </div>

                    {isEnAttente ? (
                        <div className="bg-white p-8 border-t-4 border-[#c9a84c] shadow-sm text-center">
                            <h2 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">{__('application_pending')}</h2>
                            <p className="text-gray-500 text-sm font-light leading-relaxed">{__('application_pending_msg')}</p>
                        </div>
                    ) : isAcceptee ? (
                        <div className="bg-white p-8 border-t-4 border-green-600 shadow-sm text-center">
                            <h2 className="text-xl font-bold text-green-700 mb-2 uppercase tracking-tight">{__('application_accepted')}</h2>
                            <p className="text-gray-500 text-sm font-light">{__('application_accepted_msg')}</p>
                        </div>
                    ) : (
                        <div className="bg-white p-8 md:p-12 shadow-xl shadow-black/5">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label style={labelStyle}>{__('expertise_label')}</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder={__('expertise_ph')}
                                        value={data.experience} 
                                        onChange={e => setData('experience', e.target.value)} 
                                        style={inputStyle(errors.experience)} 
                                        className="text-black"
                                    />
                                    {errors.experience && <p className="text-red-600 text-[10px] mt-1 font-bold uppercase">{errors.experience}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>{__('motivation_label')}</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder={__('motivation_ph')}
                                        value={data.motivation} 
                                        onChange={e => setData('motivation', e.target.value)} 
                                        style={inputStyle(errors.motivation)} 
                                        className="text-black"
                                    />
                                    {errors.motivation && <p className="text-red-600 text-[10px] mt-1 font-bold uppercase">{errors.motivation}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>{__('cv_label')}</label>
                                    <div className="border border-dashed border-gray-200 p-6 bg-gray-50">
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            onChange={e => setData('cv', e.target.files[0])} 
                                            className="text-[11px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-[#c9a84c] cursor-pointer"
                                        />
                                    </div>
                                    {errors.cv && <p className="text-red-600 text-[10px] mt-1 font-bold uppercase">{errors.cv}</p>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full bg-black text-white py-5 text-[10px] tracking-[3px] font-black uppercase hover:bg-[#c9a84c] transition-all disabled:bg-gray-300"
                                >
                                    {processing ? __('sending') : __('send_application')}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <footer className="py-8 text-center bg-black border-t border-white/5">
                <p className="text-[8px] tracking-[2px] text-gray-600 uppercase">
                    © 2026 ELITE SPORT LUXURY CLUBS.
                </p>
            </footer>
        </div>
    );
}