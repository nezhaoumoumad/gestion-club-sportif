<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Abonnement;

class ExportController extends Controller
{
    // Reçu pour le client (Page Mes Abonnements)
    public function downloadRecu($id)
    {
        $abonnement = Abonnement::with(['user', 'formule'])->findOrFail($id);
        $pdf = Pdf::loadView('pdf.recu', compact('abonnement'));
        return $pdf->stream('recu-elitesport.pdf');
    }

}