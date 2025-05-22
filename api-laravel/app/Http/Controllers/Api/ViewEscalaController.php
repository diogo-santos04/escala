<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ViewEscala;

class ViewEscalaController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(ViewEscala::all());
    }
}
