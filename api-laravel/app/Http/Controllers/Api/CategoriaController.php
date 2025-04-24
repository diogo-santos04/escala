<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\categoria;

class categoriaController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Categoria::all());
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

        $categoria = Categoria::create([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($categoria, 201);
    }

    // GET /item/{id}
    public function show($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        return response()->json($categoria);
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

        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Item não encontrado'], 404);
        }

        $categoria->update([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($categoria);
    }

    // DELETE /item/{id}
    public function destroy($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'categoria não encontrado'], 404);
        }

        $categoria->delete();

        return response()->json(['success' => true]);
    }
}
