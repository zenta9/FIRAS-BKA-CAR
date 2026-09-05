<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Paiement;
use App\Models\Reservation;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalReservations = Reservation::count();
        $vehiculesDisponibles = Vehicule::where('statut', 'disponible')->count();
        $totalClients = Client::count();

        $moisActuel = now()->month;
        $anneeActuelle = now()->year;

        $revenusMois = Paiement::where('statut', 'paye')
            ->whereMonth('date_paiement', $moisActuel)
            ->whereYear('date_paiement', $anneeActuelle)
            ->sum('montant');

        $revenusMoisPrecedent = Paiement::where('statut', 'paye')
            ->whereMonth('date_paiement', $moisActuel - 1)
            ->whereYear('date_paiement', $anneeActuelle)
            ->sum('montant');

        $evolutionRevenus = $revenusMoisPrecedent > 0
            ? round(($revenusMois - $revenusMoisPrecedent) / $revenusMoisPrecedent * 100)
            : 100;

        return response()->json([
            'total_reservations' => $totalReservations,
            'vehicules_disponibles' => $vehiculesDisponibles,
            'total_clients' => $totalClients,
            'revenus_mois' => $revenusMois,
            'evolution_revenus' => $evolutionRevenus,
        ]);
    }

    public function reservationsRecentes()
    {
        $reservations = Reservation::with(['client', 'vehicule'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($reservations);
    }

    public function revenus(Request $request)
    {
        $periode = $request->get('periode', 'mois');
        $annee = $request->get('annee', now()->year);

        $revenus = Paiement::where('statut', 'paye')
            ->whereYear('date_paiement', $annee)
            ->select(
                DB::raw('MONTH(date_paiement) as mois'),
                DB::raw('SUM(montant) as total')
            )
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return response()->json($revenus);
    }

    public function repartitionVehicules()
    {
        $repartition = Vehicule::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->get();

        return response()->json($repartition);
    }

    public function rappels()
    {
        $retoursAujourdhui = Reservation::where('date_fin', now()->toDateString())
            ->where('statut', 'en_cours')
            ->with(['client', 'vehicule'])
            ->get();

        $vehiculesMaintenance = Vehicule::where('statut', 'maintenance')->get();

        return response()->json([
            'retours_jour' => $retoursAujourdhui,
            'maintenance' => $vehiculesMaintenance,
        ]);
    }
}
