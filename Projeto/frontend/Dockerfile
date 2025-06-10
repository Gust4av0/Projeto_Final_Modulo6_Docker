FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Expor porta 3000
EXPOSE 3000

# Tentar diferentes comandos possíveis
CMD ["npm", "run", "dev"]
# Se não funcionar, tente: CMD ["npm", "run", "serve"]
# Ou: CMD ["node", "server.js"]