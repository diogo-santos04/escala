<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Plantao;

class PlantaoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Plantao::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'escala_mes_id' => 'required',
            'servidor_id' => 'required',
            'escala_turno_id' => 'required',
            'escala_setor_id' => 'required',
            'data_plantao' => 'required',
            'horas' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $escala = Plantao::create([
            'escala_mes_id' => $request->input('escala_mes_id'),
            'servidor_id' => $request->input('servidor_id'),           
            'escala_turno_id' => $request->input('escala_turno_id'),
            'escala_setor_id' => $request->input('escala_setor_id'),
            'data_plantao' => $request->input('data_plantao'),
            'horas' => $request->input('horas'),
        ]);

        return response()->json($escala, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $escala = Plantao::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($escala);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'escala_mes_id' => 'required',
            'servidor_id' => 'required',
            'escala_turno_id' => 'required',
            'escala_setor_id' => 'required',
            'data_plantao' => 'required',
            'horas' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $escala = Plantao::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $escala->update([
            'escala_mes_id' => $request->input('escala_mes_id'),
            'servidor_id' => $request->input('servidor_id'),           
            'escala_turno_id' => $request->input('escala_turno_id'),
            'escala_setor_id' => $request->input('escala_setor_id'),
            'data_plantao' => $request->input('data_plantao'),
            'horas' => $request->input('horas'),
        ]);

        return response()->json($escala);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $escala = Plantao::find($id);

        if (!$escala) {
            return response()->json(['error' => 'escala não encontrado'], 404);
        }

        $escala->delete();

        return response()->json(['success' => true]);
    }
}