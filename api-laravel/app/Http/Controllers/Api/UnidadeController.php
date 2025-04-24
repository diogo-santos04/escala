<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Unidade;

class UnidadeController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Unidade::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'status' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $unidade = Unidade::create([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($unidade, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $unidade = Unidade::find($id);

        if (!$unidade) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($unidade);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $unidade = Unidade::find($id);

        if (!$unidade) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $unidade->update([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($unidade);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $unidade = Unidade::find($id);

        if (!$unidade) {
            return response()->json(['error' => 'Unidade não encontrado'], 404);
        }

        $unidade->delete();

        return response()->json(['success' => true]);
    }
}