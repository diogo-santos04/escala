<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UnidadeController;
use App\Http\Controllers\Api\TurnoController;
use App\Http\Controllers\Api\ServidorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EscalaController;
use App\Http\Controllers\Api\EscalaMesController;
use App\Http\Controllers\Api\EscalaServidorController;
use App\Http\Controllers\Api\EscalaSetorController;
use App\Http\Controllers\Api\EscalaTurnoController;
use App\Http\Controllers\Api\EscalaLimiteController;
use App\Http\Controllers\Api\FeriadoController;
use App\Http\Controllers\Api\PlantaoController;
use App\Http\Controllers\Api\ViewEscalaController;
use Illuminate\Support\Facades\Route;

//ROTAS USUARIO
Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/logout", [AuthController::class, 'logout']);
Route::post("/auth/refresh", [AuthController::class, 'refresh']);
Route::post("/user", [AuthController::class, 'create']);
Route::post("/userProfissional", [AuthController::class, 'createProfissional']);
Route::get("/user", [UserController::class, 'read']);
//ROTA UNIDADE
Route::resource('/unidade', UnidadeController::class);
//ROTA TURNO
Route::resource('/turno', TurnoController::class);
//ROTA SERVIDOR
Route::resource('/servidor', ServidorController::class);
Route::post('/servidorData', [ServidorController::class, 'servidorData']);
//ROTA CATEGORIA
Route::resource('/categoria', CategoriaController::class);
//ROTA ESCALA
Route::resource('/escala', EscalaController::class);
//ROTA ESCAL MES
Route::resource('/escala_mes', EscalaMesController::class);
//ROTA ESCALA SERVIDOR
Route::resource('/escala_servidor', EscalaServidorController::class);
//ROTA ESCALA SETOR
Route::resource('/escala_setor', EscalaSetorController::class);
//ROTA ESCALA TURNO
Route::resource('/escala_turno', EscalaTurnoController::class);
//ROTA ESCALA LIMIITE
Route::resource('/escala_limite', EscalaLimiteController::class);
//ROTA FERIADO
Route::resource('/feriado', FeriadoController::class);
//ROTA PLANTAO
Route::resource('/plantao', PlantaoController::class);

Route::resource('/view_escala', ViewEscalaController::class);



