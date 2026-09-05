<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Paiement;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@firasbkacar.com',
            'password' => Hash::make('password'),
        ]);

        $vehicules = [
            [
                'marque' => 'BMW',
                'modele' => 'Série 3',
                'categorie' => 'Berline',
                'annee' => 2023,
                'transmission' => 'automatique',
                'carburant' => 'diesel',
                'places' => 5,
                'puissance' => '190 ch',
                'kilometrage' => 15000,
                'prix_jour' => 600,
                'statut' => 'disponible',
                'populaire' => true,
                'photos' => ['/images/bmw-serie3.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'Caméra de recul', 'GPS', 'Régulateur de vitesse'],
            ],
            [
                'marque' => 'Mercedes',
                'modele' => 'Classe C',
                'categorie' => 'Berline',
                'annee' => 2022,
                'transmission' => 'automatique',
                'carburant' => 'essence',
                'places' => 5,
                'puissance' => '200 ch',
                'kilometrage' => 25000,
                'prix_jour' => 800,
                'statut' => 'disponible',
                'populaire' => true,
                'photos' => ['/images/mercedes-classe-c.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'Caméra de recul', 'Sièges cuir', 'GPS', 'Vitres électriques'],
            ],
            [
                'marque' => 'Audi',
                'modele' => 'A4',
                'categorie' => 'Berline',
                'annee' => 2023,
                'transmission' => 'automatique',
                'carburant' => 'diesel',
                'places' => 5,
                'puissance' => '204 ch',
                'kilometrage' => 12000,
                'prix_jour' => 650,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/audi-a4.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'GPS', 'Caméra de recul', 'Capteurs de stationnement'],
            ],
            [
                'marque' => 'Volkswagen',
                'modele' => 'Golf 8',
                'categorie' => 'Compacte',
                'annee' => 2023,
                'transmission' => 'automatique',
                'carburant' => 'essence',
                'places' => 5,
                'puissance' => '150 ch',
                'kilometrage' => 18000,
                'prix_jour' => 500,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/vw-golf8.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'GPS', 'Vitres électriques'],
            ],
            [
                'marque' => 'Peugeot',
                'modele' => '3008',
                'categorie' => 'SUV',
                'annee' => 2022,
                'transmission' => 'automatique',
                'carburant' => 'diesel',
                'places' => 5,
                'puissance' => '180 ch',
                'kilometrage' => 30000,
                'prix_jour' => 550,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/peugeot-3008.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'Caméra de recul', 'GPS', 'Sièges bébé'],
            ],
            [
                'marque' => 'Renault',
                'modele' => 'Clio 5',
                'categorie' => 'Compacte',
                'annee' => 2023,
                'transmission' => 'manuelle',
                'carburant' => 'essence',
                'places' => 5,
                'puissance' => '90 ch',
                'kilometrage' => 10000,
                'prix_jour' => 350,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/renault-clio5.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'Vitres électriques'],
            ],
            [
                'marque' => 'Toyota',
                'modele' => 'Corolla',
                'categorie' => 'Berline',
                'annee' => 2023,
                'transmission' => 'automatique',
                'carburant' => 'hybride',
                'places' => 5,
                'puissance' => '140 ch',
                'kilometrage' => 8000,
                'prix_jour' => 450,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/toyota-corolla.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'GPS', 'Caméra de recul'],
            ],
            [
                'marque' => 'Hyundai',
                'modele' => 'Tucson',
                'categorie' => 'SUV',
                'annee' => 2022,
                'transmission' => 'automatique',
                'carburant' => 'essence',
                'places' => 5,
                'puissance' => '185 ch',
                'kilometrage' => 22000,
                'prix_jour' => 600,
                'statut' => 'disponible',
                'populaire' => false,
                'photos' => ['/images/hyundai-tucson.jpg'],
                'equipements' => ['Climatisation', 'Bluetooth', 'GPS', 'Caméra de recul', 'Sièges cuir'],
            ],
        ];

        foreach ($vehicules as $v) {
            Vehicule::create($v);
        }

        $clients = [
            ['nom_complet' => 'Mohammed Ghanmi', 'telephone' => '0612345678', 'email' => 'mohammed@gmail.com', 'cin' => 'AB123456', 'adresse' => 'Tanger, Maroc', 'password' => Hash::make('password'), 'permis_conduire' => 'permis/mohammed.jpg'],
            ['nom_complet' => 'Sara K.', 'telephone' => '0698765432', 'email' => 'sara@gmail.com', 'cin' => 'CD789012', 'adresse' => 'Tanger, Maroc', 'password' => Hash::make('password'), 'permis_conduire' => 'permis/sara.jpg'],
            ['nom_complet' => 'Ahmed B.', 'telephone' => '0654321098', 'email' => 'ahmed@gmail.com', 'cin' => 'EF345678', 'adresse' => 'Tanger, Maroc', 'password' => Hash::make('password'), 'permis_conduire' => null],
            ['nom_complet' => 'Youssef M.', 'telephone' => '0678901234', 'email' => 'youssef@gmail.com', 'cin' => 'GH901234', 'adresse' => 'Tanger, Maroc', 'password' => Hash::make('password'), 'permis_conduire' => 'permis/youssef.jpg'],
            ['nom_complet' => 'Fatima Z.', 'telephone' => '0645678901', 'email' => 'fatima@gmail.com', 'cin' => 'IJ567890', 'adresse' => 'Tanger, Maroc', 'password' => Hash::make('password'), 'permis_conduire' => null],
        ];

        foreach ($clients as $c) {
            Client::create($c);
        }

        $reservationsData = [
            ['client_id' => 1, 'vehicule_id' => 2, 'date_debut' => '2025-05-25 10:00:00', 'date_fin' => '2025-05-28 10:00:00', 'statut' => 'confirmee'],
            ['client_id' => 2, 'vehicule_id' => 1, 'date_debut' => '2025-05-24 09:00:00', 'date_fin' => '2025-05-27 09:00:00', 'statut' => 'en_cours'],
            ['client_id' => 3, 'vehicule_id' => 5, 'date_debut' => '2025-05-23 08:00:00', 'date_fin' => '2025-05-25 08:00:00', 'statut' => 'terminee'],
            ['client_id' => 4, 'vehicule_id' => 3, 'date_debut' => '2025-05-21 14:00:00', 'date_fin' => '2025-05-24 14:00:00', 'statut' => 'terminee'],
            ['client_id' => 5, 'vehicule_id' => 4, 'date_debut' => '2025-05-26 11:00:00', 'date_fin' => '2025-05-29 11:00:00', 'statut' => 'annulee'],
        ];

        foreach ($reservationsData as $rd) {
            $vehicule = Vehicule::find($rd['vehicule_id']);
            $dateDebut = \Carbon\Carbon::parse($rd['date_debut']);
            $dateFin = \Carbon\Carbon::parse($rd['date_fin']);
            $jours = max(1, $dateDebut->diffInDays($dateFin));
            $prixTotal = $vehicule->prix_jour * $jours;

            $reservation = Reservation::create([
                'numero' => Reservation::genererNumero(),
                'client_id' => $rd['client_id'],
                'vehicule_id' => $rd['vehicule_id'],
                'date_debut' => $rd['date_debut'],
                'date_fin' => $rd['date_fin'],
                'lieu_prise' => 'Tanger',
                'lieu_retour' => 'Tanger',
                'prix_total' => $prixTotal,
                'acompte' => $prixTotal * 0.30,
                'statut' => $rd['statut'],
                'mode_paiement' => 'especes',
            ]);

            Paiement::create([
                'reservation_id' => $reservation->id,
                'montant' => $reservation->acompte,
                'methode' => 'especes',
                'statut' => $rd['statut'] === 'terminee' ? 'paye' : 'en_attente',
                'date_paiement' => $rd['statut'] === 'terminee' ? $rd['date_debut'] : null,
            ]);
        }
    }
}
