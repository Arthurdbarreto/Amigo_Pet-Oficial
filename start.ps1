# Script para iniciar AmigoPet automaticamente
# Execute: .\start.ps1

Write-Host "`n🐾 ===== INICIANDO AMIGOPET =====" -ForegroundColor Cyan
Write-Host "
Write-Host "`n🐾 ===== INICIANDO AMIGOPET =====" -ForegroundColor Cyan
Write-Host "`nVerificando estrutura do projeto..." -ForegroundColor Yellow

# Verificar se está na pasta correta
if (!(Test-Path "backend") -or !(Test-Path "frontend")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto!" -ForegroundColor Red
    Write-Host "Pasta correta: Desktop\projeto-fullstack-amigopet" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Estrutura do projeto validada!" -ForegroundColor Green

# Iniciar Backend
Write-Host "`n📦 Iniciando Backend (Node.js + Express)..." -ForegroundColor Yellow
Write-Host "Local: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Swagger: http://localhost:3000/api-docs" -ForegroundColor Cyan

$backendProcess = Start-Process powershell -ArgumentList {
    cd backend
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
    Write-Host "`n✅ Backend iniciado!" -ForegroundColor Green
    npm start
} -PassThru

# Aguardar 5 segundos para o backend iniciar
Write-Host "`n⏳ Aguardando backend iniciar..." -ForegroundColor Yellow
Start-Sleep 5

# Iniciar Frontend
Write-Host "`n🎨 Iniciando Frontend (HTTP Server)..." -ForegroundColor Yellow
Write-Host "Local: http://localhost:8000/login.html" -ForegroundColor Cyan

$frontendProcess = Start-Process powershell -ArgumentList {
    cd frontend
    Write-Host "`n✅ Frontend iniciado!" -ForegroundColor Green
    
    # Tentar com Python primeiro
    if (Get-Command python -ErrorAction SilentlyContinue) {
        python -m http.server 8000
    } 
    # Se não tiver Python, tentar Node
    elseif (Get-Command npx -ErrorAction SilentlyContinue) {
        npx http-server -p 8000
    }
    else {
        Write-Host "❌ Nenhum servidor HTTP disponível" -ForegroundColor Red
        Write-Host "Instale Python ou Node.js" -ForegroundColor Red
    }
} -PassThru

# Exibir resumo
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🐾 AMIGOPET INICIADO COM SUCESSO  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n📋 INFORMAÇÕES:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8000/login.html" -ForegroundColor Cyan
Write-Host "  Swagger:  http://localhost:3000/api-docs" -ForegroundColor Cyan
Write-Host "`n👤 CRIAR CONTA:" -ForegroundColor Yellow
Write-Host "  Acesse: http://localhost:8000/register.html" -ForegroundColor Cyan
Write-Host "`n🛑 PARA ENCERRAR:" -ForegroundColor Yellow
Write-Host "  Feche as janelas de terminal ou pressione Ctrl+C" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Cyan

# Aguardar para manter os processos rodando
Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
