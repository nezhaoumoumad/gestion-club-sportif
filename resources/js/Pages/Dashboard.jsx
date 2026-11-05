import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

export default function Dashboard({ auth, hasSub }) {
    const { __ } = useTranslation();

    const actions = [
        { 
            titleKey: 'sessions',
            descKey:  'sessions_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
            href: route('seances.index'), 
            size: 'large', 
            color: 'bg-[#0f172a] text-white'
        },
        { 
            titleKey: 'my_bookings',
            descKey:  'my_bookings_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            href: route('reservations.index'), 
            size: 'small', 
            color: 'bg-white text-gray-900' 
        },
        { 
            titleKey: 'book_coach',
            descKey:  'book_coach_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            href: route('client.coachs'), 
            size: 'small', 
            color: 'bg-white text-gray-900' 
        },
        { 
            titleKey: 'coaching_history',
            descKey:  'coaching_history_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            href: route('reservations.coaching.index'), 
            size: 'small', 
            color: 'bg-white text-gray-900' 
        },
        { 
            titleKey: 'my_membership',
            descKey:  'my_membership_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
            href: route('mon.abonnement'), 
            size: 'small', 
            color: 'bg-white text-gray-900' 
        },
        { 
            titleKey: 'our_plans',
            descKey:  'our_plans_desc',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
            href: route('formules.index'), 
            size: 'large', 
            color: 'bg-[#c9a84c] text-white'
        },
    ];

    if (hasSub === false) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Espace Privé" />
                <div className="min-h-screen bg-[#fcfbf9] flex flex-col items-center justify-center font-serif">
                    <p style={{ fontSize: '9px', letterSpacing: '6px', color: '#c9a84c', textTransform: 'uppercase', fontWeight: '800', marginBottom: '20px' }}>
                        {__('membership_required')}
                    </p>
                    <h1 className="text-4xl font-light text-slate-900 mb-6 text-center">
                        {__('subscription_expired')}
                    </h1>
                    <p className="text-gray-400 text-sm mb-10 italic text-center max-w-md">
                        {__('subscription_expired_msg')}
                    </p>
                    <Link
                        href={route('formules.index')}
                        style={{ background: '#c9a84c', color: '#fff', padding: '14px 40px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none', fontWeight: '700' }}
                    >
                        {__('choose_plan')}
                    </Link>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Espace Privé" />

            <div className="min-h-screen bg-[#fcfbf9] relative font-serif pb-20">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 blur-[130px] rounded-full -z-10"></div>
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-[#c9a84c]/10 blur-[100px] rounded-full -z-10"></div>

                <div className="max-w-7xl mx-auto pt-24 px-8 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] tracking-[6px] text-[#c9a84c] uppercase font-bold font-sans mb-2 block">
                            {__('official_member')}
                        </span>
                        <h1 className="text-5xl font-light text-slate-900 tracking-tight">
                            {auth.user.prenom} <span className="font-bold text-[#0f172a] uppercase">{auth.user.nom}</span>
                        </h1>
                    </div>

                    <Link href={route('profile.edit')} className="flex items-center gap-6 group bg-white p-2 pr-6 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-14 h-14 rounded-full border-2 border-[#c9a84c] p-0.5 transition-transform group-hover:rotate-12">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-xl">
                                {auth.user.prenom[0]}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold font-sans">{__('my_account')}</span>
                            <span className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">{__('settings')}</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto mt-20 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {actions.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`
                                    group relative overflow-hidden ${item.color} border border-gray-100 p-10 
                                    transition-all duration-500 shadow-sm hover:-translate-y-2 hover:shadow-2xl
                                    ${item.size === 'large' ? 'md:col-span-3' : 'md:col-span-2'}
                                    flex flex-col justify-between min-h-[300px] rounded-sm
                                `}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className={`mb-8 transition-transform duration-500 group-hover:scale-110 ${item.color.includes('white') ? 'text-[#c9a84c]' : 'text-white/80'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-light uppercase tracking-[3px] mb-4">
                                        {__(item.titleKey)}
                                    </h3>
                                    <p className={`text-xs italic font-sans leading-relaxed tracking-wide ${item.color.includes('white') ? 'text-gray-400' : 'text-white/60'}`}>
                                        {__(item.descKey)}
                                    </p>
                                </div>
                                <div className="relative z-10 flex items-center justify-between border-t border-current/10 pt-6 mt-6">
                                    <span className="text-[9px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100">{__('explore')}</span>
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full border border-current/20 group-hover:bg-[#c9a84c] group-hover:border-[#c9a84c] group-hover:text-white transition-all duration-300">
                                        <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}