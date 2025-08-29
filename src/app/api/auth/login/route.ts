import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation des données
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Chercher l'utilisateur par username ou email
    const user = await db.collection('users').findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe (en production, il faudrait hasher les mots de passe)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, _id, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      id: user.id || user._id.toString()
    };

    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
