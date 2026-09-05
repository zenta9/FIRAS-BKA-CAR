<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('marque');
            $table->string('modele');
            $table->string('categorie');
            $table->integer('annee');
            $table->string('transmission');
            $table->string('carburant');
            $table->integer('places');
            $table->string('puissance')->nullable();
            $table->integer('kilometrage')->nullable();
            $table->decimal('prix_jour', 8, 2);
            $table->string('statut')->default('disponible');
            $table->json('photos')->nullable();
            $table->json('equipements')->nullable();
            $table->boolean('populaire')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
