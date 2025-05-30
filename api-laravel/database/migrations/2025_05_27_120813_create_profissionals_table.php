<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profissionais', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->nullable();
            $table->string('celular')->unique()->nullable();
            $table->string('cpf')->unique()->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('codigo')->unique()->nullable();
            $table->integer('user_id')->unique()->unsigned()->index()->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profissionals');
    }
};
