<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Turno;

class TurnoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Turno::all());
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

        $turno = Turno::create([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($turno, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $turno = Turno::find($id);

        if (!$turno) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($turno);
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

        $turno = Turno::find($id);

        if (!$turno) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $turno->update([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($turno);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $turno = Turno::find($id);

        if (!$turno) {
            return response()->json(['error' => 'turno não encontrado'], 404);
        }

        $turno->delete();

        return response()->json(['success' => true]);
    }
}