<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Servidor;

class ServidorController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Servidor::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'cpf' => 'required',
        ]);


        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $servidor = Servidor::create([
            'nome' => $request->input('nome'),
            'celular' => $request->input('celular'),
            'matricula' => $request->input('matricula'),
            'cpf' => $request->input('cpf'),
            'email' => $request->input('email'),
            'codigo' => rand(10000, 99999),
            'status' => $request->input('status'),
        ]);

        return response()->json($servidor, 201);
    }

    public function servidorData(Request $request)
    {
        $cpf = $request->input('cpf');
        $codigo = $request->input('codigo');

        $query = Servidor::where([
            "codigo" => $codigo,
            "cpf" => $cpf
        ]);

        $servidor = $query->first();

        if($servidor){
            return response()->json($servidor);
        }else{
            return response()->json(['message' => "servidor n encontrado"], 404);
        }
    }

    // GET /item/{id}
    public function show($id)
    {
        $servidor = Servidor::find($id);

        if (!$servidor) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($servidor);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'celular' => 'required',
            'matricula' => 'required',
            'cpf' => 'required',
            'email' => 'required',
            'codigo' => 'required',
            'user_id' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $servidor = Servidor::find($id);

        if (!$servidor) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $servidor->update([
            'nome' => $request->input('nome'),
            'celular' => $request->input('celular'),
            'matricula' => $request->input('matricula'),
            'cpf' => $request->input('cpf'),
            'email' => $request->input('email'),
            'codigo' => $request->input('codigo'),
            'user_id' => $request->input('user_id'),
            'status' => $request->input('status'),
        ]);

        return response()->json($servidor);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $servidor = Servidor::find($id);

        if (!$servidor) {
            return response()->json(['error' => 'servidor não encontrado'], 404);
        }

        $servidor->delete();

        return response()->json(['success' => true]);
    }
}