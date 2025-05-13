<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EscalaLimite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EscalaLimiteController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(EscalaLimite::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'escala_turno_id' => 'required',
            'seg' => 'required',
            'ter' => 'required',
            'qua' => 'required',
            'qui' => 'required',
            'sex' => 'required',
            'sab' => 'required',
            'dom' => 'required',
            'feriado' => 'required',
            'data_inicio' => 'required',
            'data_fim' => 'required',
            'status' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $escala = EscalaLimite::create([
            'escala_turno_id' => $request->input('escala_turno_id'),
            'seg' => $request->input('seg'),
            'ter' => $request->input('ter'),
            'qua' => $request->input('qua'),
            'qui' => $request->input('qui'),
            'sex' => $request->input('sex'),
            'sab' => $request->input('sab'),
            'dom' => $request->input('dom'),
            'feriado' => $request->input('feriado'),
            'data_inicio' => $request->input('data_inicio'),
            'data_fim' => $request->input('data_fim'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $escala = EscalaLimite::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($escala);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'escala_turno_id' => 'required',
            'seg' => 'required',
            'ter' => 'required',
            'qua' => 'required',
            'qui' => 'required',
            'sex' => 'required',
            'sab' => 'required',
            'dom' => 'required',
            'feriado' => 'required',
            'data_inicio' => 'required',
            'data_fim' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $escala = EscalaLimite::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $escala->update([
            'escala_turno_id' => $request->input('escala_turno_id'),
            'seg' => $request->input('seg'),
            'ter' => $request->input('ter'),
            'qua' => $request->input('qua'),
            'qui' => $request->input('qui'),
            'sex' => $request->input('sex'),
            'sab' => $request->input('sab'),
            'dom' => $request->input('dom'),
            'feriado' => $request->input('feriado'),
            'data_inicio' => $request->input('data_inicio'),
            'data_fim' => $request->input('data_fim'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $escala = EscalaLimite::find($id);

        if (!$escala) {
            return response()->json(['error' => 'escala não encontrado'], 404);
        }

        $escala->delete();

        return response()->json(['success' => true]);
    }
}