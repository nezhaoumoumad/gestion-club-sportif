import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const { url } = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { __, isRTL } = useTranslation();

    const isAnyDashboard = url.includes('dashboard');

    return (
        <div className="min-h-screen bg-[#fcfbf9]" dir={isRTL ? 'rtl' : 'ltr'}>
            {isAnyDashboard && (
                <nav className="bg-white h-[100px] flex items-center border-b border-gray-100 relative z-50 px-4 sm:px-12">
                    <div className="w-full flex justify-between items-center">

                        {/* LOGO */}
                        <div className="shrink-0">
                            <Link href="/" className="flex items-center">
                                <span className="text-[28px] font-extrabold tracking-[0.15em] text-black font-sans uppercase">
                                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                                </span>
                            </Link>
                        </div>

                        {/* LIENS DE NAVIGATION */}
                        <div className="hidden lg:flex items-center space-x-12">
                            <NavLink href={route('lieux.index')} active={route().current('lieux.index')}
                                className="text-black hover:text-[#c9a84c] border-[#c9a84c] text-[13px] font-bold tracking-[0.25em] uppercase transition-all duration-300">
                                {__('nav_clubs')}
                            </NavLink>
                            <NavLink href={route('sports.index')} active={route().current('sports.index')}
                                className="text-black hover:text-[#c9a84c] border-[#c9a84c] text-[13px] font-bold tracking-[0.25em] uppercase">
                                {__('nav_sports')}
                            </NavLink>
                            <NavLink href={route('formules.index')} active={route().current('formules.index')}
                                className="text-black hover:text-[#c9a84c] border-[#c9a84c] text-[13px] font-bold tracking-[0.25em] uppercase">
                                {__('nav_membership')}
                            </NavLink>
                            <Link href="#" className="text-black hover:text-[#c9a84c] text-[13px] font-bold tracking-[0.25em] uppercase transition-colors">
                                {__('nav_private')}
                            </Link>
                            <Link href="#" className="text-[#c9a84c] hover:text-black text-[13px] font-bold tracking-[0.25em] uppercase transition-colors">
                                {__('nav_coach')}
                            </Link>
                        </div>

                        {/* DROITE : Switcher + User */}
                        <div className="hidden lg:flex items-center gap-5 ml-8">
                            <LanguageSwitcher theme="light" />

                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:text-[#c9a84c] flex items-center gap-2 focus:outline-none">
                                            {user.prenom} {user.nom}
                                            <svg className="h-4 w-4 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>{__('my_profile')}</Dropdown.Link>
                                        {user.role_id === 1 && (
                                            <Dropdown.Link href="/admin/dashboard">{__('admin_panel')}</Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600">
                                            {__('logout')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <Link href={route('login')} className="text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:text-[#c9a84c]">
                                    {__('login')}
                                </Link>
                            )}
                        </div>

                        {/* MOBILE */}
                        <div className="lg:hidden flex items-center gap-3">
                            <LanguageSwitcher theme="light" />
                            <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="text-black">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d={showingNavigationDropdown ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* MENU MOBILE OVERLAY */}
                    <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} lg:hidden fixed inset-0 top-[100px] bg-white z-40 p-8 space-y-6 border-t border-gray-100`}>
                        <ResponsiveNavLink href={route('lieux.index')}>{__('nav_clubs')}</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('sports.index')}>{__('nav_sports')}</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('formules.index')}>{__('nav_membership')}</ResponsiveNavLink>
                        <hr className="border-gray-100" />
                        {user && (
                            <>
                                <ResponsiveNavLink href={route('profile.edit')}>{__('my_profile')}</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600">
                                    {__('logout')}
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>
                </nav>
            )}

            {header && (
                <header className="bg-white border-b border-gray-50 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}