<?php
header("Content-Type: application/json");

// MySQL-Verbindungsdaten
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

// JSON-Daten aus der Anfrage lesen
$input = json_decode(file_get_contents('php://input'), true);

// Eingabewerte validieren
if (!isset($input['id']) || !isset($input['menge'])) {
    http_response_code(400); // Fehlercode "Bad Request"
    echo json_encode(['success' => false, 'message' => 'Ungültige Eingabedaten.']);
    exit;
}

$id = $input['id'];
$menge = $input['menge'];

// Aktualisierung der Menge
$sql = "UPDATE produkt SET bestand = ? WHERE prodID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $menge, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren des Bestands.']);
}

$stmt->close();
$conn->close();
?>