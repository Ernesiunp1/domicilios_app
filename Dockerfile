# ETAPA 1: Construcción (Build)
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copiamos archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos
COPY . .
RUN npm run build --configuration=production

# ETAPA 2: Servidor (Runtime)
FROM nginx:alpine

# Limpiamos el directorio por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos el build desde la etapa anterior
# IMPORTANTE: Verifica si tu carpeta en dist es 'app/browser' o solo 'app'
COPY --from=build /usr/src/app/dist/app/browser /usr/share/nginx/html

# Copiamos tu configuración personalizada de Nginx para manejar rutas de Angular (SPA)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
