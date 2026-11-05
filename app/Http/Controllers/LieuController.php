<?php

namespace App\Http\Controllers;

use App\Models\Lieu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LieuController extends Controller
{
    public function index()
    {
        $lieux = Lieu::all();
        return Inertia::render('Lieux/Index', [
            'lieux' => $lieux
        ]);
    }

public function adminIndex()
{
    return Inertia::render('Admin/Lieux', [
        'lieux' => Lieu::all()
    ]);
}

    // Création d'un nouveau lieu
    public function store(Request $request)
    {
        $request->validate([
            'ville'       => 'required|string|max:255',
            'pays'        => 'required|string|max:255',
            'adresse'     => 'required|string|max:255',
            'telephone'   => 'nullable|string|max:255',
            'image' => 'nullable|file|max:5120',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['ville', 'pays', 'adresse', 'telephone', 'description']);

        if ($request->hasFile('image')) {
            // Stockage de la photo dans le dossier public/lieux
            $data['image'] = $request->file('image')->store('lieux', 'public');
        }

        Lieu::create($data);

        return redirect()->back()->with('success', 'Lieu créé avec succès');
    }

    // Formulaire de modification (Admin)
    public function edit($id)
    {
        return Inertia::render('Admin/LieuEdit', [
            'lieu' => Lieu::findOrFail($id)
        ]);
    }

    // Mise à jour du lieu
    public function update(Request $request, $id)
    {
        $lieu = Lieu::findOrFail($id);

        $request->validate([
            'ville'       => 'required|string|max:255',
            'pays'        => 'required|string|max:255',
            'adresse'     => 'required|string|max:255',
            'telephone'   => 'nullable|string|max:255',
            'image' => 'nullable|file|max:5120',
            'description' => 'nullable|string',
        ]);

        // On récupère les données textuelles
        $data = $request->only(['ville', 'pays', 'adresse', 'telephone', 'description']);

        if ($request->hasFile('image')) {
            // 1. Supprimer l'ancienne image si elle existe
            if ($lieu->image) {
                Storage::disk('public')->delete($lieu->image);
            }
            // 2. Stocker la nouvelle image
            $data['image'] = $request->file('image')->store('lieux', 'public');
        }

        $lieu->update($data);

        return redirect()->route('admin.lieux.index')->with('success', 'Lieu modifié avec succès');
    }

    // Suppression d'un lieu
    public function destroy($id)
    {
        $lieu = Lieu::findOrFail($id);

        // Supprimer la photo physiquement du stockage
        if ($lieu->image) {
            Storage::disk('public')->delete($lieu->image);
        }

        $lieu->delete();

        return redirect()->back()->with('success', 'Lieu supprimé avec succès');
    }
}