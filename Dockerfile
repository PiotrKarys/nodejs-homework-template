# Użyj oficjalnego obrazu Node.js jako bazowego
FROM node:16

# Ustaw katalog roboczy w kontenerze
WORKDIR /usr/src/app

# Skopiuj pliki package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności projektu
RUN npm install

# Skopiuj pliki źródłowe projektu
COPY . .

# Utwórz katalog dla avatarów
RUN mkdir -p public/avatars

# Otwórz port, na którym działa aplikacja
EXPOSE 3000

# Uruchom aplikację
CMD [ "npm", "start" ]