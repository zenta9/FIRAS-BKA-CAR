<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avi;
use Illuminate\Http\Request;

class AviController extends Controller
{
    public function index(Request $request)
    {
        $query = Avi::with(['client', 'vehicule']);

        if ($request->has('vehicule_id')) {
            $query->where('vehicule_id', $request->get('vehicule_id'));
        }

        $avis = $query->orderBy('created_at', 'desc')->get();

        return response()->json($avis);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'vehicule_id' => 'required|exists:vehicules,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        $avi = Avi::create($validated);

        return response()->json($avi->load(['client', 'vehicule']), 201);
    }
}
