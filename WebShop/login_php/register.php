<?php
// Verbindung zur Datenbank herstellen (Platzhalter für deine DB-Verbindungsdetails)
$servername = "localhost";
$username = "g33";
$password = "cad23dxf";
$dbname = "g33";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankverbindung fehlgeschlagen.']);
    exit;
}

// JSON-Anfrage verarbeiten
$requestData = json_decode(file_get_contents('php://input'), true);

// Eingabevalidierung
if (!isset($requestData['username']) || strlen($requestData['username']) < 3) {
    http_response_code(400);
    echo json_encode(['error' => 'Der Benutzername muss mindestens 3 Zeichen lang sein.']);
    exit;
}

if (!filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige E-Mail-Adresse.']);
    exit;
}

if (!isset($requestData['password']) || strlen($requestData['password']) < 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Das Passwort muss mindestens 8 Zeichen lang sein.']);
    exit;
}

// Benutzerdaten vorbereiten
$username = $conn->real_escape_string($requestData['username']);
$email = $conn->real_escape_string($requestData['email']);
$is_admin = 0;
$passwordHash = password_hash($requestData['password'], PASSWORD_BCRYPT);

// Überprüfen, ob die E-Mail bereits existiert
$result = $conn->query("SELECT id FROM users WHERE email = '$email'");
if ($result->num_rows > 0) {
    http_response_code(409); //Konflikt-Fehlercode
    echo json_encode(['error' => 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.']);
    exit;
}

// Benutzer in die Datenbank eintragen
$query = "INSERT INTO users (username, email, password, is_admin) VALUES ('$username', '$email', '$passwordHash', $is_admin)";
if (!$conn->query($query)) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Erstellen des Benutzers.']);
    exit;
}

// Token generieren
$token = generateToken(['username' => $username, 'email' => $email, 'is_admin' => $is_admin]);

header('Content-Type: application/json');
echo json_encode(['token' => $token]);

// Funktion zum Generieren eines JWT
function generateToken($payload) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $YOUR_SECRET_KEY = "geheimer_schluessel"; // Platzhalter für einen sicheren geheimen Schlüssel
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $YOUR_SECRET_KEY, true));
    return "$header.$payload.$signature";
}

?>