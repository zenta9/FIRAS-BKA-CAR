<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'marque',
        'modele',
        'categorie',
        'annee',
        'transmission',
        'carburant',
        'places',
        'puissance',
        'kilometrage',
        'prix_jour',
        'statut',
        'photos',
        'equipements',
        'populaire',
    ];

    protected $casts = [
        'photos' => 'array',
        'equipements' => 'array',
        'populaire' => 'boolean',
        'prix_jour' => 'decimal:2',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function avis()
    {
        return $this->hasMany(Avi::class);
    }

    public function scopeDisponibles($query)
    {
        return $query->where('statut', 'disponible');
    }

    public function scopeFiltres($query, $filters)
    {
        if (!empty($filters['categorie'])) {
            $query->where('categorie', $filters['categorie']);
        }
        if (!empty($filters['marque'])) {
            $query->where('marque', $filters['marque']);
        }
        if (!empty($filters['transmission'])) {
            $query->where('transmission', $filters['transmission']);
        }
        if (!empty($filters['carburant'])) {
            $query->where('carburant', $filters['carburant']);
        }
        if (!empty($filters['prix_min'])) {
            $query->where('prix_jour', '>=', $filters['prix_min']);
        }
        if (!empty($filters['prix_max'])) {
            $query->where('prix_jour', '<=', $filters['prix_max']);
        }
        return $query;
    }
}
