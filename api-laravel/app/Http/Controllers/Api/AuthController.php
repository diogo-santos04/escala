<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profissional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
   // public function __construct()
   // {
   //    $this->middleware("auth:api", ['except' => ['create', 'login']]);
   // }
   public function create(Request $request)
   {
      $array = ["error" => ""];

      $validator = Validator::make($request->all(), [
         'nome' => 'required',
         'nome_social' => '',
         'celular' => 'required',
         'cpf' => 'required',
         'email' => 'required',
         'password' => 'required'
      ]);

      if (!$validator->fails()) {
         $nome = $request->input("nome");
         $nome_social = $request->input("nome_social");
         $celular = $request->input("celular");
         $cpf = $request->input("cpf");
         $email = $request->input("email");
         $password = $request->input("password");

         $emailExists = User::where("email", $email)->count();
         if ($emailExists === 0) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $newUser = new User();

            $newUser->nome = $nome;
            $newUser->nome_social = $nome_social;  
            $newUser->celular = $celular;
            $newUser->cpf = $cpf;
            $newUser->email = $email;
            $newUser->password = $hash;

            $newUser->save();

            $token = auth()->attempt([
               'email' => $email,
               'password' => $password,
            ]);

            if (!$token) {
               $array['error'] = "Ocorreu um erro";
               return $array;
            }

            $info = auth()->user();
            $array['data'] = [
               'user' => $info,
               'token'=> $token
            ];

         } else {
            $array['error'] = "Email ja cadastrado";
            return $array;
         }
      } else {
         $array['error'] = "Dados incorretos";
         return $array;
      }

      return $array;
   }

   public function login(Request $request)
   {
      $array = ['error' => ''];

      $email = $request->input("email");
      $password = $request->input("password");

      $token = auth()->attempt([
         'email' => $email,
         "password" => $password,
      ]);

      if (!$token) {
         $array['error'] = "Usuario e/ou senha errado";
         return $array;
      }

      $info = auth()->user();
      $array['data'] = [
         'user' => $info,
         'token' => $token
      ];

      return $array;
   }

   public function logout()
   {
      auth()->logout();
      return response()->json(['success' => true]);
   }
}