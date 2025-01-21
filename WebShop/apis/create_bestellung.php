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
if (!isset($input['kundenID']) || !isset($input['preis'])) {
    http_response_code(400); // Fehlercode "Bad Request"
    echo json_encode(['success' => false, 'message' => 'Ungültige Eingabedaten.']);
    exit;
}

$kundenID = $input['kundenID'];
$preis = $input['preis'];

// Prepared statement to prevent SQL injection
$sql = "INSERT INTO bestellung (datum, preis_ges, kunde_kundenID, bezahlt) VALUES (SYSDATE(), ?, ?, 1)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("di", $preis, $kundenID);

if ($stmt->execute()) {
    $bestellungID = $stmt->insert_id;
    echo json_encode(['success' => true, 'bestellungID' => $bestellungID]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Erstellen der Bestellung.']);
}

$stmt->close();
$conn->close();
?>