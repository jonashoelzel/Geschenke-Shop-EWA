<?php
header('Content-Type: application/json');

// Verbindung zur Datenbank herstellen
$servername = "localhost";
$username = "g33";
$password = "cad23dxf";
$dbname = "g33";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankverbindung fehlgeschlagen."]);
    exit;
}

// Token abrufen
if (isset($_GET['token'])) {
    $token = $_GET['token'];
} else {
    http_response_code(401);
    echo json_encode(["error" => "Token fehlt."]);
    exit;
}

// Token überprüfen
$user = verifyToken($token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Ungültiges Token."]);
    exit;
}

// Adminrechte prüfen
$kundenID = $conn->real_escape_string($user['kundenID']);
$stmt = $conn->prepare("SELECT is_admin FROM kunde WHERE kundenID = ?");
$stmt->bind_param("i", $kundenID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0 || !$result->fetch_assoc()['is_admin']) {
    http_response_code(403);
    echo json_encode(["isAdmin" => false, "error" => "Zugriff verweigert. Nur für Admins."]);
    exit;
}

// Erfolgreiche Admin-Überprüfung
echo json_encode(["isAdmin" => true]);

// Funktion zum Überprüfen eines JWT
function verifyToken($token) {
    $YOUR_SECRET_KEY = "geheimer_schluessel"; // Platzhalter für deinen geheimen Schlüssel
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return false;
    }

    list($header, $payload, $signature) = $parts;

    $headerDecoded = base64_decode($header);
    $payloadDecoded = base64_decode($payload);
    $signatureCheck = base64_encode(hash_hmac('sha256', "$header.$payload", $YOUR_SECRET_KEY, true));

    if ($signatureCheck !== $signature) {
        return false;
    }

    return json_decode($payloadDecoded, true);
}
?>