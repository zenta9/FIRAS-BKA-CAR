<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicule_id')->constrained()->onDelete('cascade');
            $table->datetime('date_debut');
            $table->datetime('date_fin');
            $table->string('lieu_prise')->default('Tanger');
            $table->string('lieu_retour')->default('Tanger');
            $table->decimal('prix_total', 10, 2);
            $table->decimal('acompte', 8, 2)->default(0);
            $table->string('statut')->default('confirmee');
            $table->string('mode_paiement')->default('especes');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
