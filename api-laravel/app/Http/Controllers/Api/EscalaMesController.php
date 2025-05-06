<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\EscalaMes;

class EscalaMesController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(EscalaMes::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'unidade_id' => 'required',
            'categoria_id' => 'required',
            'status' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $escala = EscalaMes::create([
            'nome' => $request->input('nome'),
            'unidade_id' => $request->input('unidade_id'),
            'categoria_id' => $request->input('categoria_id'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $escala = EscalaMes::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($escala);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'unidade_id' => 'required',
            'escala_id' => 'required',
            'mes_ano' => 'required',
            'inicio_selecao' => 'required',
            'publicidade' => 'required',
            'configuracao' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $escala = EscalaMes::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $escala->update([
            'unidade_id' => $request->input('unidade_id'),
            'escala_id' => $request->input('escala_id'),
            'mes_ano' => $request->input('mes_ano'),
            'inicio_selecao' => $request->input('inicio_selecao'),
            'publicidade' => $request->input('publicidade'),
            'configuracao' => $request->input('configuracao'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $escala = EscalaMes::find($id);

        if (!$escala) {
            return response()->json(['error' => 'escala não encontrado'], 404);
        }

        $escala->delete();

        return response()->json(['success' => true]);
    }
}