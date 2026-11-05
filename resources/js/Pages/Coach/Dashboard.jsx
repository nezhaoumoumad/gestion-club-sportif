import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslation } from '@/i18n';

export default function CoachDashboard({ auth, reservations = [], profil }) {
    const { __ } = useTranslation();

    const { data, setData, patch, processing } = useForm({
        specialite: profil?.specialite || '',
        bio: profil?.bio || '',
        disponible: profil?.disponible ?? true,
    });

    const submitProfil = (e) => {
        e.preventDefault();
        patch(route('coach.profil.update'));
    };

    const handleAction = (id, action) => {
        const routeName = action === 'confirmer' ? 'coach.coaching.confirm' : 'coach.coaching.reject';
        if (confirm(`Voulez-vous vraiment ${action === 'confirmer' ? 'confirmer' : 'refuser'} cette séance ?`)) {
            router.patch(route(routeName, id));
        }
    };

    const goldColor = '#c9a84c';

    const maintenat = new Date();

    const estDepassee = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/');
        const dateObjet = new Date(`${year}-${month}-${day}T${timePart}`);
        return dateObjet < maintenat;
    };

    const enAttente = reservations.filter(r => r.statut === 'en_attente' && !estDepassee(r.date_seance));
    const confirmees = reservations.filter(r => r.statut === 'confirmee' && !estDepassee(r.date_seance));
    const annulees   = reservations.filter(r => ['annulee', 'refusee', 'expiree'].includes(r.statut) || estDepassee(r.date_seance));

    const ReservationTable = ({ items, showActions = false, emptyMessage }) => (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f2f2f2' }}>
                    <th style={{ padding: '12px', fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>{__('client_label')}</th>
                    <th style={{ padding: '12px', fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>{__('date_label')}</th>
                    <th style={{ padding: '12px', fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>{__('status_label')}</th>
                    {showActions && <th style={{ padding: '12px', fontSize: '10px', color: '#999', textAlign: 'right' }}>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {items.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#ccc', fontSize: '12px' }}>{emptyMessage || __('no_reservation')}</td></tr>
                ) : (
                    items.map((rdv) => {
                        const depassee = estDepassee(rdv.date_seance);
                        return (
                            <tr key={rdv.id} style={{ borderBottom: '1px solid #f9f9f9', opacity: depassee ? 0.6 : 1, backgroundColor: depassee ? '#fafafa' : 'transparent' }}>
                                <td style={{ padding: '15px 12px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{rdv.user?.prenom} {rdv.user?.nom}</div>
                                    <div style={{ fontSize: '11px', color: '#aaa' }}>{rdv.user?.email}</div>
                                </td>
                                <td style={{ padding: '15px 12px', fontSize: '13px', color: '#555' }}>{rdv.date_seance}</td>
                                <td style={{ padding: '15px 12px' }}>
                                    <span style={{ 
                                        fontSize: '9px', padding: '4px 8px', fontWeight: 'bold', borderRadius: '2px',
                                        background: (rdv.statut === 'confirmee' && !depassee) ? '#e6fffa' : (rdv.statut === 'en_attente' && !depassee) ? '#fff9e6' : '#f5f5f5',
                                        color:      (rdv.statut === 'confirmee' && !depassee) ? '#2ecc71' : (rdv.statut === 'en_attente' && !depassee) ? goldColor : '#888',
                                    }}>
                                        {depassee ? __('ended') : rdv.statut.toUpperCase().replace('_', ' ')}
                                    </span>
                                </td>
                                {showActions && (
                                    <td style={{ padding: '15px 12px', textAlign: 'right' }}>
                                        {!depassee && (
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleAction(rdv.id, 'confirmer')} style={{ background: 'none', border: 'none', color: '#2ecc71', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{__('confirm_btn')}</button>
                                                <button onClick={() => handleAction(rdv.id, 'refuser')}   style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{__('refuse_btn')}</button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );

    return (
        <AuthenticatedLayout user={auth.user} header={<h2>{__('coach_space')}</h2>}>
            <Head title="Tableau de bord Coach" />
            <div style={{ padding: '40px', background: '#fcfbf9', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
                        <aside>
                            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <form onSubmit={submitProfil}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '10px', color: goldColor, fontWeight: 'bold', marginBottom: '8px' }}>{__('specialty_label')}</label>
                                        <input type="text" value={data.specialite} onChange={e => setData('specialite', e.target.value)} style={{ width: '100%', border: '1px solid #e2e2e2', padding: '12px', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '10px', color: goldColor, fontWeight: 'bold', marginBottom: '8px' }}>{__('bio_label')}</label>
                                        <textarea value={data.bio} onChange={e => setData('bio', e.target.value)} style={{ width: '100%', border: '1px solid #e2e2e2', padding: '12px', borderRadius: '4px', minHeight: '120px' }} />
                                    </div>
                                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" id="disponible" checked={data.disponible} onChange={e => setData('disponible', e.target.checked)} />
                                        <label htmlFor="disponible" style={{ fontSize: '12px', color: '#555' }}>{__('available_label')}</label>
                                    </div>
                                    <button disabled={processing} style={{ width: '100%', background: '#111', color: '#fff', padding: '15px', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>{__('update_btn')}</button>
                                </form>
                            </div>
                        </aside>
                        <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <section style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: goldColor }}>{__('pending_requests')}</h3>
                                <ReservationTable items={enAttente} showActions={true} />
                            </section>
                            <section style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#2ecc71' }}>{__('upcoming_coach')}</h3>
                                <ReservationTable items={confirmees} showActions={false} />
                            </section>
                            <section style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', opacity: 0.8 }}>
                                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>{__('history_refusals')}</h3>
                                <ReservationTable items={annulees} showActions={false} emptyMessage={__('no_history_coach')} />
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}