import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

// ==========================================
// 1. LE COMPOSANT MODAL (SÉCURISÉ)
// ==========================================
const CheckoutModal = ({ isOpen, onClose, onConfirm, formule }) => {
    if (!isOpen) return null;

    const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '' });
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const filterName = (val) => val.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    const filterNumbers = (val) => val.replace(/\D/g, ''); 
    const filterDate = (val) => {
        let clean = val.replace(/\D/g, ''); 
        if (clean.length > 2) return clean.substring(0, 2) + '/' + clean.substring(2, 4);
        return clean;
    };

    useEffect(() => {
        if (isOpen) {
            setCard({ name: '', number: '', exp: '', cvc: '' });
            setError('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handlePayClick = () => {
        setError('');
        if (!card.name || !card.number || !card.exp || !card.cvc) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (card.number.length < 16) {
            setError('Le numéro de carte doit avoir 16 chiffres.');
            return;
        }
        setIsProcessing(true);
        onConfirm(formule.id);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#0a0a0a', padding: '48px', border: '1px solid #c9a84c', width: '450px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '2px' }}>Paiement Sécurisé</p>
                <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '8px', color: '#fff' }}>Finaliser l'adhésion</h2>
                <p style={{ color: '#666', marginBottom: '32px' }}>{formule?.nom} — {formule?.prix} DH</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                    <input type="text" placeholder="NOM SUR LA CARTE" value={card.name} onChange={(e) => setCard({...card, name: filterName(e.target.value)})} style={{ background: 'transparent', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                    <input type="text" maxLength="16" placeholder="NUMÉRO DE CARTE" value={card.number} onChange={(e) => setCard({...card, number: filterNumbers(e.target.value)})} style={{ background: 'transparent', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input type="text" maxLength="5" placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({...card, exp: filterDate(e.target.value)})} style={{ background: 'transparent', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '12px', width: '50%', outline: 'none' }} />
                        <input type="text" maxLength="3" placeholder="CVC" value={card.cvc} onChange={(e) => setCard({...card, cvc: filterNumbers(e.target.value)})} style={{ background: 'transparent', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '12px', width: '50%', outline: 'none' }} />
                    </div>
                </div>
                {error && <p style={{ color: '#ff4444', fontSize: '12px', marginBottom: '16px', fontWeight: 'bold' }}>{error}</p>}
                <button onClick={handlePayClick} disabled={isProcessing} style={{ background: isProcessing ? '#444' : '#c9a84c', color: '#000', width: '100%', padding: '16px', border: 'none', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isProcessing ? 'Traitement...' : 'Confirmer le paiement'}
                </button>
                <button onClick={onClose} style={{ background: 'transparent', color: '#444', marginTop: '16px', border: 'none', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase' }}>Annuler</button>
            </div>
        </div>
    );
};

// ==========================================
// 2. LA PAGE PRINCIPALE
// ==========================================
export default function FormulesIndex({ formules, auth, aDejaUnAbonnement }) {
    const [selectedFormule, setSelectedFormule] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedFormule, setExpandedFormule] = useState(null);
    const { __, isRTL } = useTranslation();

    const goldColor = '#c9a84c';

    const detailsParFormule = {
        'Basique': [
            'Accès illimité à toutes les séances de sport',
            'Pratiquez l\'ensemble des disciplines du club sans restriction',
            'Disponibilité totale des installations sportives',
            'Accès libre 7j/7 selon les horaires d\'ouverture'
        ],
        'Premium': [
            'Accès illimité à toutes les séances de sport',
            'Accès à l\'ensemble des disciplines du club',
            '5 Réservations de coaching par mois incluses',
            'Accompagnement personnalisé lors de vos séances réservées'
        ],
        'VIP': [
            'Accès illimité à toutes les séances de sport',
            'Accès à l\'ensemble des disciplines du club',
            'Séances de coaching en illimité',
            'Un suivi expert sans aucune restriction de réservation'
        ]
    };

    const ouvrirPaiement = (formule) => {
        if (aDejaUnAbonnement) {
            alert("Action impossible : Vous avez déjà un abonnement actif.");
            return; 
        }
        setSelectedFormule(formule);
        setIsModalOpen(true);
    };

    const validerAbonnement = (formuleId) => {
        router.post(route('abonnements.store'), { formule_id: formuleId }, {
            onSuccess: () => {
                setIsModalOpen(false);
                alert('Félicitations ! Votre abonnement Élite est maintenant actif.');
            }
        });
    };

    return (
        <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <Head title="Membership | ELITE SPORT" />
            <CheckoutModal isOpen={isModalOpen} formule={selectedFormule} onClose={() => setIsModalOpen(false)} onConfirm={validerAbonnement} />

            {/* NAVIGATION */}
            <nav className="bg-black h-20 px-6 md:px-12 flex justify-between items-center z-[100] relative border-b border-white/10 w-full">
                <Link href="/" className="text-xl font-black tracking-[0.3em] uppercase cursor-pointer text-white no-underline">
                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                </Link>
                <div className="hidden lg:flex items-center gap-10">
                    <Link href={route('lieux.index')}            className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_clubs')}</Link>
                    <Link href={route('sports.index')}           className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_sports')}</Link>
                    <Link href={route('formules.index')}         className="text-[10px] tracking-[0.2em] uppercase font-bold text-white transition-colors border-b border-[#c9a84c]">{__('nav_membership')}</Link>
                    <Link href={route('personal-training.index')} className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors">{__('nav_private')}</Link>
                    <Link href={route('candidature.create')}     className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c9a84c] hover:opacity-80 transition-all">{__('nav_coach')}</Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* 🌐 SWITCHER */}
                    <LanguageSwitcher theme="dark" />
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] hover:text-white transition-all">
                            {__('my_space')}
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')}    className="text-[10px] tracking-[0.2em] font-bold uppercase text-white">{__('login')}</Link>
                            <Link href={route('register')} className="bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#c9a84c] hover:text-white transition-all">{__('join')}</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-screen w-full overflow-hidden">
                <img src="/images/membership-hero.jpg" alt="Elite Membership" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-start justify-center p-12 md:p-24 bg-black/40">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic text-left leading-none">
                        {__('membership_hero_title')}
                    </h1>
                    <p className="max-w-3xl text-lg md:text-xl font-light tracking-wide text-white/90 text-left">
                        {__('membership_hero_desc')}
                    </p>
                </div>
            </div>

            {/* SECTION CARACTÉRISTIQUES */}
            <div className="py-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 text-left">
                    <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                        {__('your_exclusive_benefits')}
                    </h2>
                </div>
                <div className="md:w-1/2">
                    <ul className="space-y-6 text-lg font-light text-gray-300">
                        <li className="flex items-start gap-4"><span className="text-[#c9a84c] mt-1">●</span> {__('benefit_1')}</li>
                        <li className="flex items-start gap-4"><span className="text-[#c9a84c] mt-1">●</span> {__('benefit_2')}</li>
                        <li className="flex items-start gap-4"><span className="text-[#c9a84c] mt-1">●</span> {__('benefit_3')}</li>
                        <li className="flex items-start gap-4"><span className="text-[#c9a84c] mt-1">●</span> {__('benefit_4')}</li>
                        <li className="flex items-start gap-4"><span className="text-[#c9a84c] mt-1">●</span> {__('benefit_5')}</li>
                    </ul>
                </div>
            </div>

            {/* SECTION FORMULES */}
            <div className="py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {formules.map((formule, i) => (
                            <div 
                                key={formule.id} 
                                className="bg-black border border-white/10 p-12 text-center flex flex-col items-center transition-all hover:border-[#c9a84c]"
                                style={{ borderTop: i === 1 ? `4px solid ${goldColor}` : '1px solid rgba(255,255,255,0.1)' }}
                            >
                                {i === 1 && <p className="text-[10px] tracking-[2px] text-[#c9a84c] uppercase mb-4 font-bold">{__('elite_choice')}</p>}
                                <p className="text-[11px] tracking-[4px] uppercase text-gray-500 mb-8">{formule.nom}</p>
                                <p className="text-7xl font-light text-white mb-10">{formule.prix} <span className="text-xl">DH</span></p>
                                <button 
                                    onClick={() => auth?.user ? ouvrirPaiement(formule) : router.get('/register')} 
                                    className={`w-full py-5 text-[11px] tracking-[2px] uppercase font-bold transition-all border ${
                                        i === 1 ? 'bg-[#c9a84c] text-black border-[#c9a84c]' : 'bg-transparent text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c] hover:text-black'
                                    }`}
                                >
                                    {auth?.user ? (aDejaUnAbonnement ? __('active_plan') : __('select_plan')) : __('join')}
                                </button>
                                <button 
                                    onClick={() => setExpandedFormule(expandedFormule === formule.id ? null : formule.id)}
                                    className="mt-6 text-[10px] tracking-[2px] uppercase text-gray-600 underline bg-none border-none cursor-pointer"
                                >
                                    {expandedFormule === formule.id ? __('hide_details') : __('show_details')}
                                </button>
                                {expandedFormule === formule.id && (
                                    <div className="mt-8 pt-8 border-t border-white/5 w-full text-left">
                                        <ul className="text-xs text-gray-500 space-y-4 font-light">
                                            {(detailsParFormule[formule.nom] || detailsParFormule['Basique']).map((detail, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-[#c9a84c]">/</span> {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="py-20 text-center border-t border-white/5 w-full">
                <Link href="/" className="text-xl font-black tracking-[0.4em] uppercase mb-4 text-white no-underline">
                    ELITE<span className="text-[#c9a84c]">SPORT</span>
                </Link>
                <p className="text-[10px] tracking-[3px] text-gray-600 uppercase">{__('footer_rights')}</p>
            </footer>
        </div>
    );
}