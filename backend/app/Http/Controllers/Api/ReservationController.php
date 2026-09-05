<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Paiement;
use App\Models\Reservation;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['client', 'vehicule']);

        if ($request->has('statut')) {
            $query->where('statut', $request->get('statut'));
        }

        $reservations = $query->orderBy('created_at', 'desc')->get();

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $client = $request->user();

        if (!$client) {
            return response()->json(['message' => 'Vous devez être connecté pour réserver'], 401);
        }

        if (empty($client->permis_conduire)) {
            return response()->json(['message' => 'Vous devez télécharger votre permis de conduire avant de réserver'], 422);
        }

        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'date_debut' => 'required|date|after:now',
            'date_fin' => 'required|date|after:date_debut',
            'lieu_prise' => 'required|string|max:255',
            'lieu_retour' => 'required|string|max:255',
            'mode_paiement' => 'required|in:especes,visa,mastercard,cmi',
            'notes' => 'nullable|string',
        ]);

        $vehicule = Vehicule::findOrFail($validated['vehicule_id']);

        if ($vehicule->statut !== 'disponible') {
            return response()->json(['message' => 'Véhicule non disponible'], 422);
        }

        $dateDebut = \Carbon\Carbon::parse($validated['date_debut']);
        $dateFin = \Carbon\Carbon::parse($validated['date_fin']);
        $jours = $dateDebut->diffInDays($dateFin);
        if ($jours < 1) $jours = 1;

        $prixTotal = $vehicule->prix_jour * $jours;
        $acompte = $prixTotal * 0.30;

        $reservation = Reservation::create([
            'numero' => Reservation::genererNumero(),
            'client_id' => $client->id,
            'vehicule_id' => $vehicule->id,
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'lieu_prise' => $validated['lieu_prise'],
            'lieu_retour' => $validated['lieu_retour'],
            'prix_total' => $prixTotal,
            'acompte' => $acompte,
            'statut' => 'confirmee',
            'mode_paiement' => $validated['mode_paiement'],
            'notes' => $validated['notes'] ?? null,
        ]);

        Paiement::create([
            'reservation_id' => $reservation->id,
            'montant' => $acompte,
            'methode' => $validated['mode_paiement'],
            'statut' => $validated['mode_paiement'] === 'especes' ? 'en_attente' : 'paye',
            'date_paiement' => $validated['mode_paiement'] !== 'especes' ? now() : null,
        ]);

        $reservation->load(['client', 'vehicule']);

        return response()->json($reservation, 201);
    }

    public function show($numero)
    {
        $reservation = Reservation::with(['client', 'vehicule', 'paiements'])
            ->where('numero', $numero)
            ->firstOrFail();

        return response()->json($reservation);
    }

    public function mesReservations(Request $request)
    {
        $client = $request->user();

        $reservations = Reservation::with(['vehicule', 'paiements'])
            ->where('client_id', $client->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservations);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'sometimes|in:confirmee,en_cours,terminee,annulee',
            'notes' => 'nullable|string',
        ]);

        $reservation->update($validated);

        return response()->json($reservation->load(['client', 'vehicule']));
    }

    public function annuler($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Réservation annulée']);
    }
}
