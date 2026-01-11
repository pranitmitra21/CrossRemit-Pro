@echo off
cd /d "%~dp0"
echo ===================================================
echo   Starting CrossRemit Pro - Full Stack
echo ===================================================
echo.
echo IMPORTANT: Ensure MetaMask is configured correctly!
echo.

echo 1. Starting Hardhat Local Blockchain...
start "Hardhat Node" cmd /k "npx hardhat node"

echo    Waiting for Hardhat node to initialize...
timeout /t 5 /nobreak >nul

echo 2. Deploying Smart Contracts...
start "Contract Deployment" cmd /c "npx hardhat run Scripts/deploy-local.js --network localhost && timeout /t 3 && exit"

echo    Waiting for contract deployment...
timeout /t 8 /nobreak >nul

echo 3. Starting Backend API...
start "Backend API" cmd /k "cd backend && node server.js"

echo    Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo 4. Starting Frontend Application...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo    Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo 5. Opening browser...
start http://localhost:5173

echo.
echo ===================================================
echo   All Services Started Successfully!
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:3001
echo   Hardhat:   http://localhost:8545
echo.
echo   SERVICES RUNNING:
echo   - Hardhat Local Blockchain (Port 8545)
echo   - Smart Contracts Deployed
echo   - Backend API Server (Port 3001)
echo   - Frontend Dev Server (Port 5173)
echo.
echo   NEXT STEPS:
echo   1. Browser should open automatically
echo   2. Connect MetaMask wallet
echo   3. Import test accounts from Hardhat node
echo   4. Start using the application!
echo.
echo   To stop all services, close all terminal windows
echo ===================================================
echo.
pause
