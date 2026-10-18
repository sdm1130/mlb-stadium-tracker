# Production image for Coolify (stadiumtracker.stevenmurphy.net).
# A plain static site served by nginx: no build step, no server-side data.
# Visits and games live in each browser's localStorage and sync via Firebase.
FROM nginx:1.30.6-alpine3.24

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

RUN nginx -t

EXPOSE 80
