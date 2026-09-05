<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('password')->nullable()->after('nom_complet');
            $table->string('permis_conduire')->nullable()->after('adresse');
            $table->string('statut')->default('actif')->after('permis_conduire');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['password', 'permis_conduire', 'statut']);
        });
    }
};
