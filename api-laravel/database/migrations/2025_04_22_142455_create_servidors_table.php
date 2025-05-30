<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('servidors', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('celular');
            $table->string('matricula');
            $table->string('cpf');
            $table->string('email');
            $table->string('codigo');
            $table->string('user_id')->nullable();
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS servidors CASCADE');
    }
};
