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
        Schema::create('escala_servidors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('escala_id')->nullable();
            $table->foreign('escala_id')->references('id')->on('escalas')->onUpdate('cascade')->onDelete('set null');
            $table->unsignedBigInteger('servidor_id')->nullable();
            $table->foreign('servidor_id')->references('id')->on('servidors')->onUpdate('cascade')->onDelete('set null');
            $table->integer("score")->nullable();
            $table->boolean("status")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escala_servidors');
    }
};
