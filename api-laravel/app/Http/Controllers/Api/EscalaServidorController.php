<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\EscalaServidor;

class EscalaServidorController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(EscalaServidor::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'escala_id' => 'required',
            'servidor_id' => 'required',
            'score' => 'required',
            'status' => 'required',
        ]);

        // dd(vars: $validator);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $escala = EscalaServidor::create([
            'escala_id' => $request->input('escala_id'),
            'servidor_id' => $request->input('servidor_id'),
            'score' => $request->input('score'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $escala = EscalaServidor::find($id);

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
            'servidor_id' => 'required',
            'score' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados inválidos'], 400);
        }

        $escala = EscalaServidor::find($id);

        if (!$escala) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $escala->update([
            'escala_id' => $request->input('escala_id'),
            'servidor_id' => $request->input('servidor_id'),
            'score' => $request->input('score'),
            'status' => $request->input('status'),
        ]);

        return response()->json($escala);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $escala = EscalaServidor::find($id);

        if (!$escala) {
            return response()->json(['error' => 'escala não encontrado'], 404);
        }

        $escala->delete();

        return response()->json(['success' => true]);
    }
}