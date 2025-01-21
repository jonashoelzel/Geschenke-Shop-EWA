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
if (!isset($requestData['email']) || !filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
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
$email = $conn->real_escape_string($requestData['email']);
$password = $requestData['password'];

// Benutzer aus der Datenbank abrufen
$stmt = $conn->prepare("SELECT kundenID, username, password, is_admin FROM kunde WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['error' => 'E-Mail-Adresse oder Passwort ist falsch.']);
    exit;
}

$user = $result->fetch_assoc();
$storedPasswordHash = $user['password'];

// Passwort überprüfen
if (!password_verify($password, $storedPasswordHash)) {
    http_response_code(401);
    echo json_encode(['error' => 'E-Mail-Adresse oder Passwort ist falsch.']);
    exit;
}

// Token generieren
$token = generateToken(['username' => $user['username'], 'email' => $email, 'is_admin' => $user['is_admin']]);

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
