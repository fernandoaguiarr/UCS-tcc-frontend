# Dockerfile

# Etapa 1: Construção da aplicação com Node.js
FROM node:20.11.1-alpine3.19 AS build

WORKDIR /app
COPY package.json ./

RUN npm install

ENV PATH=/app/node_modules/.bin:$PATH

COPY . .

RUN npm run build

# Etapa 2: Configuração do servidor com Nginx
FROM nginx:1.25.4-alpine3.18

# Copie o arquivo de configuração para o local correto
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copie os arquivos da build para o diretório do Nginx
COPY --from=build /app/dist /var/www/html/

# Exponha a porta (opcional para documentação)
EXPOSE 8080

# Inicialize o Nginx
CMD echo "Starting Nginx on PORT: $PORT" && \
    sed -i -e 's/\$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
