<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('escala_limites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('escala_turno_id')->nullable();
            $table->foreign('escala_turno_id')->references('id')->on('escala_turnos')->onUpdate('cascade')->onDelete('set null');   
            $table->integer('seg')->nullable();
            $table->integer('ter')->nullable();
            $table->integer('qua')->nullable();
            $table->integer('qui')->nullable();
            $table->integer('sex')->nullable();
            $table->integer('sab')->nullable();
            $table->integer('dom')->nullable(); 
            $table->integer('feriado')->nullable();
            $table->dateTime('data_inicio')->nullable();
            $table->dateTime('data_fim')->nullable();
            $table->boolean('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escala_limites');
    }
};
