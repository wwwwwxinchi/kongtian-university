#!/bin/sh
set -eu
# Invoke from a private release directory containing frontend.tar.gz and campus-card.env.
cd "$(dirname "$0")"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup=/var/backups/campus-card/$stamp
web=/var/www/kongtian.university
config=$(readlink -f /etc/nginx/sites-enabled/kongtian.university)
mkdir -p "$backup" /opt/campus-card /var/lib/campus-card /etc/nginx/snippets
chmod 700 "$backup"
cp "$web/index.html" "$backup/index.html"
cp "$config" "$backup/nginx.conf"
printf '%s\n' "$config" > "$backup/nginx-path.txt"
if [ -d "$web/campus-card" ]; then tar -czf "$backup/previous-activity.tar.gz" -C "$web" campus-card css/campus-card-event.css; fi
if [ -f /opt/campus-card/server.py ]; then cp /opt/campus-card/server.py "$backup/server.py"; fi
id campus-card >/dev/null 2>&1 || useradd --system --home /var/lib/campus-card --shell /usr/sbin/nologin campus-card
chown -R campus-card:campus-card /var/lib/campus-card
chmod 700 /var/lib/campus-card
if [ ! -f /etc/campus-card.env ]; then install -m 600 campus-card.env /etc/campus-card.env; fi
install -m 644 server.py /opt/campus-card/server.py
install -m 644 campus-card.service /etc/systemd/system/campus-card.service
install -m 644 nginx.conf /etc/nginx/snippets/campus-card.conf
systemctl daemon-reload
systemctl enable --now campus-card
systemctl restart campus-card
for attempt in 1 2 3 4 5; do
    if curl -fsS http://127.0.0.1:3118/api/campus-card/status >/dev/null; then break; fi
    sleep 1
done
curl -fsS http://127.0.0.1:3118/api/campus-card/status
tar -xzf frontend.tar.gz -C "$web"
python3 - "$config" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
source = p.read_text()
line = '    include /etc/nginx/snippets/campus-card.conf;\n'
if line not in source:
    if '    location / {' not in source:
        raise SystemExit('Unexpected nginx configuration; nothing modified')
    p.write_text(source.replace('    location / {', line + '\n    location / {', 1))
PY
if ! nginx -t; then
    cp "$backup/nginx.conf" "$config"
    cp "$backup/index.html" "$web/index.html"
    echo 'Nginx validation failed; original configuration and homepage restored' >&2
    exit 1
fi
systemctl reload nginx
printf '\nBackup: %s\n' "$backup"
systemctl is-active campus-card
