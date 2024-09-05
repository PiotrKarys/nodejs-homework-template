const bcrypt = require("bcryptjs");

const password = "password123"; // Hasło do porównania
const hashedPassword =
  "$2a$10$K8Piiy3ohJByxq54NgfxSOj7VC2rcpy2YbyVDhSzAcIyx1JaKb34S"; // Hasło z bazy danych

bcrypt.compare(password, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else {
    console.log("Password match result:", result); // Oczekiwany wynik: true
  }
});
