# 🔗 Comment récupérer votre URL Neon

## Étape 1 : Aller sur Neon

Ouvrez ce lien : https://console.neon.tech/

## Étape 2 : Se connecter

Connectez-vous à votre compte Neon.

## Étape 3 : Sélectionner votre projet

Cliquez sur votre projet (celui que vous avez créé pour cette application).

## Étape 4 : Trouver la Connection String

Vous devriez voir une section "Connection Details" ou "Connection String".

Cherchez une ligne qui ressemble à ça :

```
postgresql://username:password@ep-cool-shape-123456.us-east-2.aws.neon.tech/neondb
```

## Étape 5 : Copier l'URL complète

**IMPORTANT :** Ajoutez `?sslmode=require` à la fin si ce n'est pas déjà là !

Votre URL finale devrait ressembler à :

```
postgresql://username:password@ep-cool-shape-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## ✅ Vous avez votre URL !

Maintenant, passez à l'étape suivante pour créer le fichier .env.local.

