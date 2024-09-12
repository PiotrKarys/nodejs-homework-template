# Node.js API for User Management and Contacts

## Opis projektu

Ta aplikacja to API stworzone w Node.js, które umożliwia zarządzanie
użytkownikami oraz ich kontaktami. Aplikacja wykorzystuje Express.js do obsługi
żądań HTTP, MongoDB jako bazę danych oraz różne inne biblioteki do obsługi
autoryzacji, przesyłania plików, walidacji danych i wysyłania e-maili.

## Funkcjonalności

### Zarządzanie użytkownikami

- **Rejestracja użytkownika**: Użytkownicy mogą się zarejestrować, podając swój
  e-mail i hasło. Po rejestracji wysyłany jest e-mail weryfikacyjny.
- **Weryfikacja e-maila**: Użytkownicy muszą zweryfikować swój e-mail, klikając
  link weryfikacyjny wysłany na ich adres e-mail.
- **Logowanie**: Zweryfikowani użytkownicy mogą się zalogować, podając swój
  e-mail i hasło.
- **Wylogowanie**: Zalogowani użytkownicy mogą się wylogować.
- **Aktualizacja subskrypcji**: Zalogowani użytkownicy mogą zmienić swój plan
  subskrypcji.
- **Aktualizacja awatara**: Zalogowani użytkownicy mogą przesłać i zaktualizować
  swój awatar.
- **Pobieranie danych aktualnego użytkownika**: Zalogowani użytkownicy mogą
  pobrać swoje dane.

### Zarządzanie kontaktami

- **Dodawanie kontaktów**: Użytkownicy mogą dodawać nowe kontakty.
- **Pobieranie kontaktów**: Użytkownicy mogą pobierać listę swoich kontaktów.
- **Aktualizacja kontaktów**: Użytkownicy mogą aktualizować istniejące kontakty.
- **Usuwanie kontaktów**: Użytkownicy mogą usuwać kontakty.

## Technologie

- **Node.js**: Środowisko uruchomieniowe JavaScript.
- **Express.js**: Framework do budowy aplikacji webowych.
- **MongoDB**: Baza danych NoSQL.
- **Mongoose**: ODM (Object Data Modeling) dla MongoDB.
- **JWT**: JSON Web Tokens do autoryzacji.
- **SendGrid**: Usługa do wysyłania e-maili.
- **Multer**: Middleware do obsługi przesyłania plików.
- **Jimp**: Biblioteka do przetwarzania obrazów.
- **Docker**: Konteneryzacja aplikacji.

## Instalacja

1. Sklonuj repozytorium:

git clone https://github.com/your-username/nodejs-homework-template.git cd
nodejs-homework-template

2. Zainstaluj zależności:

npm install

## Uruchomienie

1. Uruchom serwer w trybie deweloperskim:

npm run start:dev

2. Uruchom serwer w trybie produkcyjnym:

npm start

### Docker

1. Zbuduj obraz Docker:

   docker build -t nodejs-api .

2. Uruchom kontener:

   docker run -p 3000:3000 --env-file .env nodejs-api

## Endpointy

### Użytkownicy

- \`POST /api/users/signup\` - Rejestracja nowego użytkownika
- \`GET /api/users/verify/:verificationToken\` - Weryfikacja e-maila
- \`POST /api/users/login\` - Logowanie użytkownika
- \`POST /api/users/verify\` - Wysłanie ponownego e-maila weryfikacyjnego
- \`GET /api/users/logout\` - Wylogowanie użytkownika
- \`GET /api/users/current\` - Pobranie danych aktualnego użytkownika
- \`PATCH /api/users/subscription\` - Aktualizacja subskrypcji użytkownika
- \`PATCH /api/users/avatars\` - Aktualizacja awatara użytkownika

### Kontakty

- \`POST /api/contacts\` - Dodanie nowego kontaktu
- \`GET /api/contacts\` - Pobranie listy kontaktów
- \`GET /api/contacts/:id\` - Pobranie szczegółów kontaktu
- \`PATCH /api/contacts/:id\` - Aktualizacja kontaktu
- \`DELETE /api/contacts/:id\` - Usunięcie kontaktu
