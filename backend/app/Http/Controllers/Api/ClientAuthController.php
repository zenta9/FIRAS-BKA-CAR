<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ClientAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom_complet' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'telephone' => 'required|string|max:20|unique:clients,telephone',
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'cin' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
        ]);

        $client = Client::create([
            'nom_complet' => $validated['nom_complet'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'password' => Hash::make($validated['password']),
            'cin' => $validated['cin'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
        ]);

        $token = $client->createToken('client-token')->plainTextToken;

        return response()->json([
            'client' => $client,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $client = Client::where('email', $credentials['email'])->first();

        if (!$client || !Hash::check($credentials['password'], $client->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $client->createToken('client-token')->plainTextToken;

        return response()->json([
            'client' => $client,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $client = $request->user();

        $validated = $request->validate([
            'nom_complet' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'cin' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function uploadPermis(Request $request)
    {
        $request->validate([
            'permis_conduire' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $client = $request->user();

        if ($client->permis_conduire && file_exists(storage_path('app/public/' . $client->permis_conduire))) {
            unlink(storage_path('app/public/' . $client->permis_conduire));
        }

        $file = $request->file('permis_conduire');
        $path = $file->store('permis', 'public');

        $client->update(['permis_conduire' => $path]);

        return response()->json([
            'message' => 'Permis uploadé avec succès',
            'permis_conduire' => $path,
        ]);
    }
}
