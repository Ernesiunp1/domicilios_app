# Etapa de construcción
FROM node:18 AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiamos el build de Angular
# NOTA: Verifica que 'dist/app/browser' sea la ruta correcta. 
# En versiones nuevas de Angular es dist/nombre-proyecto/browser, 
# en antiguas es solo dist/nombre-proyecto.
COPY --from=build /usr/src/app/dist/app/browser /usr/share/nginx/html

# Copiamos la configuración de Nginx que creamos en el Paso 1
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80