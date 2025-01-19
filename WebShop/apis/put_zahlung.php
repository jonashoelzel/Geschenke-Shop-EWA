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
if (!isset($input['kundenID'])) {
    http_response_code(400); // Fehlercode "Bad Request"
    echo json_encode(['success' => false, 'message' => 'Ungültige Eingabedaten.']);
    exit;
}

// kunden ID muss iwi aus aktueller session geholt werden idk - hier aktuell selbst angegeben
$kundenID = $input['kundenID'];
$preis = $input['preis'];

$sql = "INSERT into bestellung (datum, preis_ges, kunde_kundenID, bezahlt) VALUES (SYSDATE(), $preis, $kundenID, 1)";
$result = $conn->query($sql);

echo json_encode(['success' => true]);



?>