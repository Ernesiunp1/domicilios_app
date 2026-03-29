# Ya no hay "FROM node", porque ya compilaste en tu casa
# Usamos Nginx ligero
FROM nginx:alpine

# Copiamos los archivos compilados que subiste
# La ruta coincide con tu 'ls -R': dist -> app -> browser
COPY dist/app/browser /usr/share/nginx/html

# Copiamos la configuración del servidor
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
