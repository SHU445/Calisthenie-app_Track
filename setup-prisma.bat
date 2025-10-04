@echo off
echo ========================================
echo Configuration de Prisma pour votre application
echo ========================================
echo.

echo Etape 1/3: Generation du client Prisma...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo ERREUR lors de la generation du client Prisma
    pause
    exit /b %errorlevel%
)
echo OK!
echo.

echo Etape 2/3: Creation des tables dans la base de donnees...
call npm run prisma:push
if %errorlevel% neq 0 (
    echo ERREUR lors de la creation des tables
    echo Verifiez que DATABASE_URL est configure dans .env.local
    pause
    exit /b %errorlevel%
)
echo OK!
echo.

echo Etape 3/3: Import des exercices de base...
call npm run prisma:seed
if %errorlevel% neq 0 (
    echo ERREUR lors de l'import des exercices
    pause
    exit /b %errorlevel%
)
echo OK!
echo.

echo ========================================
echo Configuration terminee avec succes!
echo ========================================
echo.
echo Vous pouvez maintenant demarrer l'application avec: npm run dev
echo Ou ouvrir Prisma Studio avec: npm run prisma:studio
echo.
pause

