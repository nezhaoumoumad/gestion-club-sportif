<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Seance;
use App\Models\Paiement;
use App\Models\Formule;
use App\Models\Candidature;
use App\Models\ProfilCoach;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use Illuminate\Support\Facades\Mail;
use App\Mail\MailAcceptationCoach;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            $totalVilles = DB::table('lieux')->count();
            $totalSports = DB::table('sports')->count();
        } catch (\Exception $e) {
            $totalVilles = 0; $totalSports = 0;
        }

        // LOGIQUE GRAPHIQUES
        $statsRoles = [
            ['name' => 'Coachs', 'value' => User::where('role_id', 3)->count()],
            ['name' => 'Clients', 'value' => User::where('role_id', 2)->count()],
        ];

        $statsRecettes = Paiement::select(
            DB::raw('DATE_FORMAT(created_at, "%b") as mois'),
            DB::raw('SUM(montant) as total')
        )
        ->where('created_at', '>=', now()->subMonths(5))
        ->groupBy('mois', DB::raw('MONTH(created_at)'))
        ->orderBy(DB::raw('MONTH(created_at)'), 'asc')
        ->get();

        $statsInscriptions = User::select(
            DB::raw('DATE_FORMAT(created_at, "%b") as mois'),
            DB::raw('COUNT(id) as nouveaux')
        )
        ->where('role_id', 2)
        ->where('created_at', '>=', now()->subMonths(5))
        ->groupBy('mois', DB::raw('MONTH(created_at)'))
        ->orderBy(DB::raw('MONTH(created_at)'), 'asc')
        ->get();
        

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_membres'    => User::where('role_id', 2)->count(),
                'equipe_coachs'    => ProfilCoach::where('is_active_admin', true)
                                        ->where('disponible', true)
                                        ->count(),
                'seances_planning' => Seance::count(),
                'abonnes_actifs'   => User::where('role_id', 2)
                    ->where('statut', 'actif')
                    ->whereHas('abonnements', function($query) {
                        $query->where('statut', 'actif')
                              ->where('date_fin', '>=', now());
                    })->count(),
                'chiffre_affaires' => Paiement::sum('montant'),
                'total_villes'     => $totalVilles,
                'total_sports'     => $totalSports,
            ],
            'statsRoles' => $statsRoles,
            'statsRecettes' => $statsRecettes,
            'statsInscriptions' => $statsInscriptions
        ]);
    }

    public function users()
    {
        $users = User::where('role_id', 2)->with(['abonnements'])->get()->map(function($user) {
            $isSubscribed = $user->aAbonnementValide();
            $aDejaEuUnAbo = $user->abonnements->isNotEmpty();

            if ($user->statut === 'inactif') {
                $category  = 'inactif';
                $sousTexte = 'Désactivé par Admin';
            } elseif ($isSubscribed) {
                $category  = 'actif';
                $sousTexte = 'Abonnement à jour';
            } elseif ($aDejaEuUnAbo) {
                $category  = 'inactif';
                $sousTexte = 'Abonnement expiré';
            } else {
                $category  = 'inactif';
                $sousTexte = 'Pas de formule';
            }

            return [
                'id'               => $user->id,
                'nom'              => $user->nom,
                'prenom'           => $user->prenom,
                'email'            => $user->email,
                'telephone'        => $user->telephone ?? 'N/A',
                'has_paid'         => $isSubscribed,
                'statut_technique' => $user->statut,
                'category'         => $category,
                'sous_texte'       => $sousTexte,
                'created_at'       => $user->created_at,
            ];
        });

        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    public function showUser($id)
    {
        $client = User::with([
            'abonnements.formule',
            'abonnements.paiements',
            'reservations.seance.sport',
            'reservationsCoaching.profilCoach.user',
        ])->findOrFail($id);

        $maintenant = new \DateTime();

        $tousLesPaiements = $client->abonnements->flatMap(function ($abonnement) {
            return $abonnement->paiements->map(function ($paiement) use ($abonnement) {
                $paiement->abonnement_date_fin = $abonnement->date_fin;
                return $paiement;
            });
        });
        $client->setRelation('paiements', $tousLesPaiements);

        $client->reservations->transform(function ($res) use ($maintenant) {
            if (
                in_array($res->statut, ['confirmee', 'en_attente']) &&
                $res->seance &&
                new \DateTime($res->seance->date_heure) < $maintenant
            ) {
                $res->statut = 'terminee';
            }
            return $res;
        });

        $client->reservationsCoaching->transform(function ($res) use ($maintenant) {
            $dateBrute = $res->getRawOriginal('date_seance');
            $dt = Carbon::parse($dateBrute);
            if (
                in_array($res->statut, ['confirmee', 'en_attente']) &&
                $dt->isPast()
            ) {
                $res->statut = 'terminee';
            }
            return $res;
        });

        return Inertia::render('Admin/UserDetails', [
            'client' => $client
        ]);
    }

    public function editUser($id)
    {
        return Inertia::render('Admin/UserEdit', [
            'client' => User::findOrFail($id)
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $validated = $request->validate([
            'prenom'    => 'required|string|max:255',
            'nom'       => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $id,
            'telephone' => 'nullable|string|max:20',
        ]);

        User::findOrFail($id)->update($validated);
        return redirect()->route('admin.users')->with('success', 'Profil mis à jour.');
    }

    public function toggleUser($id)
    {
        $u = User::findOrFail($id);
        $u->statut = ($u->statut === 'actif') ? 'inactif' : 'actif';
        $u->save();

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }

    public function destroyUser($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->route('admin.users');
    }

    public function candidatures()
    {
        return Inertia::render('Admin/Candidatures', [
            'candidatures' => Candidature::with('user')->get()
        ]);
    }



public function accepterCandidature($id)
{
    $candidature = Candidature::findOrFail($id);
    $candidature->update(['statut' => 'acceptee']);

    $user = $candidature->user;
    $user->update(['role_id' => 3]);

    if (!ProfilCoach::where('user_id', $user->id)->exists()) {
        ProfilCoach::create([
            'user_id'         => $user->id,
            'is_active_admin' => true,
            'disponible'      => true,
            'specialite'      => 'À définir',
            'bio'             => null,
        ]);
    }

    //  ENVOI DE L'EMAIL
    Mail::to($user->email)->send(new MailAcceptationCoach($user));

    return redirect()->back()->with('success', 'Candidature acceptée et profil créé avec succès.');
}

    public function refuserCandidature($id)
    {
        $candidature = Candidature::findOrFail($id);
        $candidature->update(['statut' => 'refusee']);
        return redirect()->back()->with('success', 'Candidature refusée.');
    }

    public function formules()
    {
        return Inertia::render('Admin/Formules', ['formules' => Formule::all()]);
    }

    public function paiements()
{
    $paiementsActifs = Paiement::with(['abonnement.user'])
        ->whereHas('abonnement', function ($q) {
            $q->where('statut', 'actif')
              ->where('date_fin', '>=', now())
              ->whereHas('user', function ($qu) {
                  $qu->where('role_id', 2);
              });
        })
        ->orderByDesc('created_at')
        ->get()
        ->map(fn($p) => [
            'nom'     => $p->abonnement->user->nom    ?? '—',
            'prenom'  => $p->abonnement->user->prenom ?? '—',
            'email'   => $p->abonnement->user->email  ?? '—',
            'date'    => $p->created_at->format('d/m/Y'),
            'montant' => number_format($p->montant, 2, '.', ''),
            'statut_compte' => $p->abonnement->user->statut ?? 'inactif',
        ]);

    $totalActifs = Paiement::whereHas('abonnement', function ($q) {
        $q->where('statut', 'actif')
          ->where('date_fin', '>=', now())
          ->whereHas('user', function ($qu) {
              $qu->where('role_id', 2);
          });
    })->sum('montant');

    $tousLesPaiements = Paiement::with(['abonnement.user'])
        ->orderByDesc('created_at')
        ->get()
        ->map(fn($p) => [
            'nom'           => $p->abonnement->user->nom    ?? '—',
            'prenom'        => $p->abonnement->user->prenom ?? '—',
            'email'         => $p->abonnement->user->email  ?? '—',
            'date'          => $p->created_at->format('d/m/Y'),
            'montant'       => number_format($p->montant, 2, '.', ''),
            'statut_abo'    => $p->abonnement->statut       ?? '—',
            'date_fin'      => $p->abonnement->date_fin     ?? null,
            'statut_compte' => $p->abonnement->user->statut ?? '—',
            'role'          => $p->abonnement->user->role_id ?? 2,
        ]);

    //  APPEL DE LA PROCÉDURE STOCKÉE
    DB::statement("CALL GetTotalGeneralRecettes(@t)");
    $resultatProcedure = DB::select("SELECT @t AS total");
    $totalGeneral = $resultatProcedure[0]->total ?? 0;

    // 3. RETOUR VERS INERTIA (Inchangé)
    return Inertia::render('Admin/Paiements', [
        'paiements_actifs'  => $paiementsActifs,
        'total_actifs'      => number_format($totalActifs, 2, '.', ''),
        'tous_paiements'    => $tousLesPaiements,
        'total_general'     => number_format($totalGeneral, 2, '.', ''),
    ]);
}

    // --- EXPORT DES MEMBRES ---
public function exportMembresXML()
{
    $membres = User::where('role_id', 2)->get();
    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><membres/>');

    foreach ($membres as $m) {
        $node = $xml->addChild('membre');
        $node->addChild('id', $m->id);
        $node->addChild('nom', htmlspecialchars($m->nom));
        $node->addChild('prenom', htmlspecialchars($m->prenom));
        $node->addChild('email', $m->email);
    }

    return response($xml->asXML(), 200)->header('Content-Type', 'application/xml')
        ->header('Content-Disposition', 'attachment; filename="membres.xml"');
}

// --- EXPORT DES COACHS ---
public function exportCoachsXML()
{
    $coachs = User::where('role_id', 3)->get();
    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><coachs/>');

    foreach ($coachs as $c) {
        $node = $xml->addChild('coach');
        $node->addChild('id', $c->id);
        $node->addChild('nom', htmlspecialchars($c->nom));
        $node->addChild('prenom', htmlspecialchars($c->prenom));
        $node->addChild('specialite', $c->profilCoach->specialite ?? 'N/A');
    }

    return response($xml->asXML(), 200)->header('Content-Type', 'application/xml')
        ->header('Content-Disposition', 'attachment; filename="coachs.xml"');
}

// --- EXPORT DES PAIEMENTS ---
public function exportPaiementsXML()
{
    $paiements = Paiement::with('abonnement.user')->get();
    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><comptabilite/>');

    foreach ($paiements as $p) {
        $node = $xml->addChild('paiement');
        $node->addChild('reference', $p->id);
        $node->addChild('client', htmlspecialchars($p->abonnement->user->nom ?? 'Inconnu'));
        $node->addChild('montant', $p->montant . ' DH');
        $node->addChild('date', $p->created_at->format('d/m/Y'));
    }

    return response($xml->asXML(), 200)->header('Content-Type', 'application/xml')
        ->header('Content-Disposition', 'attachment; filename="paiements_totaux.xml"');
}

public function viewLogs()
{
    // On récupère les logs du plus récent au plus ancien
    $logs = \App\Models\LogSuppression::orderBy('date_suppression', 'desc')->get();

    return Inertia::render('Admin/Logs', [
        'logs' => $logs
    ]);
}
}