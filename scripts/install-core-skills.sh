#!/usr/bin/env bash
# Çekirdek skill setini kullanıcı seviyesine (veya verilen hedefe) kurar.
# Kullanıcı seviyesine kurulunca skiller TÜM projelerde geçerli olur.
set -euo pipefail

TARGET="${HOME}/.claude/skills"
FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --force)  FORCE=1; shift ;;
    -h|--help)
      echo "kullanim: $0 [--target <dizin>] [--force]"
      echo "  varsayilan hedef: ~/.claude/skills (tum projelerde gecerli)"
      exit 0 ;;
    *) echo "bilinmeyen argüman: $1" >&2; exit 2 ;;
  esac
done

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.claude/skills"
[ -d "$SRC" ] || { echo "kaynak bulunamadi: $SRC" >&2; exit 1; }

mkdir -p "$TARGET"
installed=0; skipped=0
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  [ -f "$dir/SKILL.md" ] || continue
  if [ -e "$TARGET/$name" ] && [ "$FORCE" -eq 0 ]; then
    echo "atlandi (mevcut): $name  — üzerine yazmak için --force"
    skipped=$((skipped+1)); continue
  fi
  rm -rf "$TARGET/$name"
  cp -R "$dir" "$TARGET/$name"
  echo "kuruldu: $name"
  installed=$((installed+1))
done

echo "---"
echo "hedef: $TARGET"
echo "kurulan: $installed, atlanan: $skipped"
echo "Claude Code'u yeniden başlat, sonra doğrula: /skills veya 'hangi skiller var?'"
