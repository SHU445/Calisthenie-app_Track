import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateEmail, validatePassword, validateUsername } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validation des données
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation du nom d'utilisateur
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { error: usernameValidation.errors[0] },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Vérifier si l'utilisateur ou l'email existe déjà
    const existingUser = await db.collection('users').findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      const message = existingUser.username === username 
        ? 'Ce nom d\'utilisateur est déjà pris'
        : 'Cette adresse email est déjà utilisée';
      
      return NextResponse.json(
        { error: message },
        { status: 409 }
      );
    }

    // Générer un ID unique pour l'utilisateur
    const lastUser = await db.collection('users').findOne({}, { sort: { id: -1 } });
    const maxId = lastUser?.id ? parseInt(lastUser.id) : 0;
    const newId = (maxId + 1).toString();

    // Créer le nouvel utilisateur
    const newUser = {
      id: newId,
      username,
      email,
      password, // En production, il faudrait hasher le mot de passe
      dateCreation: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        units: 'metric',
        language: 'fr'
      }
    };

    // Insérer dans MongoDB
    await db.collection('users').insertOne(newUser);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
