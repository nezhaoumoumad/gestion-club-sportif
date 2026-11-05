<?php

namespace App\Http\Controllers;

use App\Models\Sport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SportController extends Controller
{
    public function index()
    {
        return Inertia::render('Sports/Index', ['sports' => Sport::all()]);
    }

    public function adminIndex()
    {
        return Inertia::render('Admin/Sports', [
            'sports' => Sport::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['nom', 'description']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('sports', 'public');
        }

        Sport::create($data);
        return redirect()->back()->with('success', 'Sport créé avec succès');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/SportEdit', [
            'sport' => Sport::findOrFail($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        Log::info('Method reçue: ' . $request->method());
        Log::info('Has file image: ' . ($request->hasFile('image') ? 'oui' : 'non'));

        $sport = Sport::findOrFail($id);
        
        $request->validate([
            'nom'         => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048', 
        ]);

        $data = $request->only(['nom', 'description']);

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($sport->image) {
                Storage::disk('public')->delete($sport->image);
            }
            // Stockage dans 'sports'
            $data['image'] = $request->file('image')->store('sports', 'public');
        }

        $sport->update($data);

        return redirect()->route('admin.sports.index')->with('success', 'Sport modifié avec succès');
    }

    public function destroy($id)
    {
        $sport = Sport::findOrFail($id);
        if ($sport->image) {
            Storage::disk('public')->delete($sport->image);
        }
        $sport->delete();
        return redirect()->back()->with('success', 'Sport supprimé avec succès');
    }

}