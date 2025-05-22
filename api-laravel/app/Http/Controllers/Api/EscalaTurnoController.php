<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\EscalaTurno;

class EscalaTurnoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(EscalaTurno::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'escala_id' => 'required',
            'nome' => 'required',
            'cor' => 'required',
            'letra' => 'required',
            'hora_inicio' => 'required',
            'hora_fim' => 'required',
            'horas' => 'required',
            'status' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $escala = EscalaTurno::create([
            'escala_id' => $request->input('escala_id'),
            'nome' => $request->input('nome'),
            'cor' => $request->input('cor'),
            'letra' => $request->input('letra'),
            'hora_inicio' => $request->input('hora_inicio'),
            'hora_fim' => $request->input('hora_fim'), 
            'horas' => $request->input('horas'),           
            'status' => $request->input('status'),
        ]);

        dd($escala);

        return response()->json($escala, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $escala = EscalaTurno::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($escala);
    }

    // PUT/PATCH /item/{id}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'escala_id' => 'required',
            'nome' => 'required',
            'cor' => 'required',
            'letra' => 'required',
            'hora_inicio' => 'required',
            'hora_fim' => 'required',
            'horas' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $escala = EscalaTurno::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $escala->update([
            'escala_id' => $request->input('escala_id'),
            'nome' => $request->input('nome'),
            'cor' => $request->input('cor'),
            'letra' => $request->input('letra'),
            'hora_inicio' => $request->input('hora_inicio'),
            'hora_fim' => $request->input('hora_fim'), 
            'horas' => $request->input('horas'),           
            'status' => $request->input('status'),
        ]);

        return response()->json($escala);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $escala = EscalaTurno::find($id);

        if (!$escala) {
            return response()->json(['error' => 'escala não encontrado'], 404);
        }

        $escala->delete();

        return response()->json(['success' => true]);
    }
}