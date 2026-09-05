<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index(Request $request)
    {
        $query = Paiement::with('reservation.client');

        if ($request->has('statut')) {
            $query->where('statut', $request->get('statut'));
        }

        $paiements = $query->orderBy('created_at', 'desc')->get();

        return response()->json($paiements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'montant' => 'required|numeric|min:0',
            'methode' => 'required|in:especes,visa,mastercard,cmi',
        ]);

        $paiement = Paiement::create([
            ...$validated,
            'statut' => 'paye',
            'date_paiement' => now(),
        ]);

        $reservation = Reservation::find($validated['reservation_id']);
        $totalPaye = $reservation->paiements()->where('statut', 'paye')->sum('montant');

        if ($totalPaye >= $reservation->prix_total) {
            $reservation->update(['statut' => 'payee']);
        }

        return response()->json($paiement->load('reservation'), 201);
    }

    public function show($id)
    {
        $paiement = Paiement::with('reservation.client')->findOrFail($id);

        return response()->json($paiement);
    }
}
