<#
.SYNOPSIS
    CEZERI Web Intelligence — Windows kurulum sarmalayicisi.

.DESCRIPTION
    Node.js'i dogrular ve asil kurucuyu (install.mjs) calistirir.
    Kurulum idempotenttir: tekrar calistirmak guvenlidir.

.PARAMETER DryRun
    Hicbir dosya yazmadan ne yapilacagini gosterir.

.PARAMETER NoMcp
    Playwright MCP adimini atlar.

.PARAMETER Uninstall
    Kurulumu geri alir (install yerine uninstall calisir).

.EXAMPLE
    .\install.ps1
    .\install.ps1 -DryRun
    .\install.ps1 -Uninstall
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$NoMcp,
    [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Head($t) { Write-Host "`n$t" -ForegroundColor Cyan }
function Write-Ok($t)   { Write-Host "  [OK] $t" -ForegroundColor Green }
function Write-Err($t)  { Write-Host "  [HATA] $t" -ForegroundColor Red }

Write-Head "CEZERI Web Intelligence — Windows kurulum"

# --- Node.js kontrolu ---------------------------------------------------
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Err "Node.js bulunamadi."
    Write-Host ""
    Write-Host "  YAPILACAK TEK ADIM: Node.js 18+ kurun -> https://nodejs.org" -ForegroundColor Yellow
    Write-Host "  Kurduktan sonra YENI bir PowerShell penceresi acip bu scripti tekrar calistirin."
    Write-Host ""
    exit 1
}

$nodeVersion = (& node --version).TrimStart('v')
$major = [int]($nodeVersion.Split('.')[0])
if ($major -lt 18) {
    Write-Err "Node $nodeVersion bulundu, en az 18 gerekli."
    Write-Host ""
    Write-Host "  YAPILACAK TEK ADIM: Node.js 18+ surumune yukseltin -> https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Write-Ok "Node $nodeVersion"

# --- Asil kurucuyu calistir ---------------------------------------------
$script = if ($Uninstall) { 'uninstall.mjs' } else { 'install.mjs' }
$target = Join-Path $here $script

if (-not (Test-Path $target)) {
    Write-Err "$script bulunamadi: $target"
    exit 1
}

$nodeArgs = @($target)
if ($DryRun) { $nodeArgs += '--dry-run' }
if ($NoMcp -and -not $Uninstall) { $nodeArgs += '--no-mcp' }

& node @nodeArgs
$code = $LASTEXITCODE

if ($code -ne 0) {
    Write-Err "$script hata kodu $code ile bitti."
    exit $code
}

if (-not $Uninstall -and -not $DryRun) {
    Write-Host "Saglik kontrolu icin:" -ForegroundColor Cyan
    Write-Host "  node `"$(Join-Path $here 'healthcheck.mjs')`""
    Write-Host ""
}

exit 0
