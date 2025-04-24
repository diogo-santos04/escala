<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UnidadeController;
use App\Http\Controllers\Api\TurnoController;
use App\Http\Controllers\Api\ServidorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EscalaController;
use Illuminate\Support\Facades\Route;

Route::get("/teste", function(){
    return ['teste' => true];
});

//ROTAS USUARIO
Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/logout", [AuthController::class, 'logout']);
Route::post("/auth/refresh", [AuthController::class, 'refresh']);
Route::post("/user", [AuthController::class, 'create']);
Route::get("/user", [UserController::class, 'read']);
//ROTA UNIDADE
Route::resource('/unidade', UnidadeController::class);
//ROTA TURNO
Route::resource('/turno', TurnoController::class);
//ROTA SERVIDOR
Route::resource('/servidor', ServidorController::class);
//ROTA CATEGORIA
Route::resource('/categoria', CategoriaController::class);
//ROTA ESCALA
Route::resource('/escala', EscalaController::class);

