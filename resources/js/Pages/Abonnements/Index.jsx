import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

export default function Index({ auth, abonnements, abonnement }) {
    const listeAbonnements = abonnements || (abonnement ? [abonnement] : []);
    const { __, isRTL } = useTranslation();

    const luxuryFont = { fontFamily: "'Georgia', serif" };
    const goldColor  = '#c9a84c';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div style={{ ...luxuryFont, width: '100%' }} dir={isRTL ? 'rtl' : 'ltr'}>
                    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                        <Link href="/" style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '6px', color: '#000', textDecoration: 'none', textTransform: 'uppercase' }}>
                            ELITE<span style={{ color: goldColor }}>SPORT</span>
                        </Link>
                        <Link href={route('dashboard')} style={{ color: goldColor, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', textDecoration: 'none', fontWeight: 'bold', borderBottom: `1px solid ${goldColor}`, paddingBottom: '2px' }}>
                            {__('back')}
                        </Link>
                    </nav>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '6px', color: goldColor, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '15px' }}>
                            {__('membership_label')}
                        </p>
                        <h2 className="font-light text-5xl text-gray-900 leading-tight tracking-tighter">
                            {__('my_subscriptions')}
                        </h2>
                        <div style={{ width: '60px', height: '1px', background: goldColor, margin: '25px auto 0' }}></div>
                    </div>
                </div>
            }
        >
            <Head title="Mes Abonnements" />

            <div className="py-12" style={luxuryFont} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {(!listeAbonnements || listeAbonnements.length === 0) ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-20 text-center">
                                <p className="text-gray-400 text-lg mb-6 italic">
                                    Vous n'avez aucun abonnement actif pour le moment.
                                </p>
                                <Link href={route('formules.index')} style={{ color: goldColor, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${goldColor}`, paddingBottom: '4px' }}>
                                    Découvrir les formules →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {listeAbonnements.map((item) => {
                                const estValide = item.statut === 'actif' && new Date(item.date_fin) >= new Date();
                                return (
                                    <div key={item.id}
                                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-10 flex justify-between items-center border-l-4"
                                        style={{ borderLeftColor: estValide ? goldColor : '#ddd', opacity: estValide ? 1 : 0.5, filter: estValide ? 'none' : 'grayscale(60%)' }}
                                    >
                                        <div>
                                            <p style={{ fontSize: '10px', letterSpacing: '3px', color: estValide ? goldColor : '#aaa', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
                                                {__('premium_club')}
                                            </p>
                                            <h3 className="text-3xl font-light text-gray-900 mb-4">
                                                Formule {item.formule?.nom || 'Élite'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>
                                                    Statut : <b style={{ color: estValide ? '#16a34a' : '#dc2626' }}>
                                                        {estValide ? __('status_active') : __('status_inactive')}
                                                    </b>
                                                </span>
                                                <span>|</span>
                                                <span>{__('expires_on')} : {new Date(item.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-light text-gray-900">{item.formule?.prix} dh</p>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 mb-6">{__('payment_validated')}</p>
                                            <a href={route('abonnements.recu', item.id)} target="_blank"
                                                style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#000', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #000', padding: '10px 20px', display: 'inline-block', transition: 'all 0.3s' }}
                                                onMouseOver={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}
                                                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#000'; }}
                                            >
                                                Télécharger le reçu
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center py-10 text-[10px] tracking-[4px] text-gray-300 uppercase">
                Elite Sport Luxury Management
            </div>
        </AuthenticatedLayout>
    );
}