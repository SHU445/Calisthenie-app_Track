@echo off
echo ========================================
echo Creation du fichier .env.local
echo ========================================
echo.

echo DATABASE_URL="REMPLACEZ_PAR_VOTRE_URL_NEON" > .env.local

echo ✓ Fichier .env.local cree avec succes !
echo.
echo ========================================
echo IMPORTANT : Modifiez maintenant le fichier
echo ========================================
echo.
echo 1. Ouvrez le fichier .env.local
echo 2. Remplacez "REMPLACEZ_PAR_VOTRE_URL_NEON" par votre vraie URL Neon
echo 3. L'URL doit ressembler a :
echo    postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
echo 4. Enregistrez le fichier
echo.
echo Ensuite, executez :
echo   npx prisma generate
echo   npx prisma db push
echo   npm run prisma:seed
echo   npm run dev
echo.
pause

