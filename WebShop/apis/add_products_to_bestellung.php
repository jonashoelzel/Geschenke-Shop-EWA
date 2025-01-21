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
if (!isset($input['bestellungID']) || !isset($input['produkte']) || !is_array($input['produkte'])) {
    http_response_code(400); // Fehlercode "Bad Request"
    echo json_encode(['success' => false, 'message' => 'Ungültige Eingabedaten.']);
    exit;
}

$bestellungID = $input['bestellungID'];
$produkte = $input['produkte'];

foreach ($produkte as $produkt) {
    if (!isset($produkt['prodID']) || !isset($produkt['menge'])) {
        http_response_code(400); // Fehlercode "Bad Request"
        echo json_encode(['success' => false, 'message' => 'Ungültige Produktdaten.']);
        exit;
    }

    $prodID = $produkt['prodID'];
    $menge = $produkt['menge'];

    $sql = "INSERT INTO best_produkt (menge, best_bestellID, prod_prodID) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $menge, $bestellungID, $prodID);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Produkts zur Bestellung.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    // Update the product stock
    $sql = "UPDATE produkt SET bestand = bestand - ? WHERE prodID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $menge, $prodID);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren des Bestands.']);
        $stmt->close();
        $conn->close();
        exit;
    }

    $stmt->close();
}

echo json_encode(['success' => true]);

$conn->close();
?>