#!/bin/sh

RCLI_REDMINE_HOST=${RCLI_REDMINE_HOST?Missing env var RCLI_REDMINE_HOST}
REDMINE_PROXY_HOST=https://${RCLI_REDMINE_HOST}

# Prepare nginx configuration on-the-fly.
cat << EOF > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  charset utf-8;

  gzip on;
  gzip_types
      text/css
      text/javascript
      text/xml
      text/plain
      application/javascript
      application/x-javascript
      application/json
      application/xml
      application/rss+xml
      application/atom+xml
      font/truetype
      font/opentype
      image/svg+xml;

  location /api/ {
    proxy_pass ${REDMINE_PROXY_HOST}/;
    proxy_pass_header Authorization;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Frame-Options "deny";

    # Add CORS headers the Redmine API is lacking.
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods * always;
  }

  # Serve assets.
  location / {
    alias ${NGINX_ROOT};
    # Use backwards slash to prevent shell expansion.
    try_files /\$uri /index.html =404;
  }
}
EOF

echo "Launching NGINX reverse proxy, /api forwards to ${REDMINE_PROXY_HOST} ..."

# Run nginx.
nginx -g 'daemon off;'
