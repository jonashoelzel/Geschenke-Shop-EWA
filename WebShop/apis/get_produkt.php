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

// Artikel-ID aus dem GET-Parameter lesen
$artikelId = isset($_GET['id']) ? $_GET['id'] : null;

if($artikelId){
    // Prüfen, ob die ID exakt 5 Zeichen lang ist und nur aus Ziffern besteht
    if (!preg_match('/^\d{5}$/', $artikelId)) {
        http_response_code(400); // 400 Bad Request
        echo json_encode(['error' => 'Ungültige Artikel-ID. ID muss genau 5 Ziffern enthalten.']);
        exit;
    }

    // SQL-Abfrage
    $sql = "SELECT * FROM produkt WHERE prodID = $artikelId";
    $result = $conn->query($sql);

    $artikel = $result->fetch_assoc();

    if ($artikel) {
        // Artikel als JSON zurückgeben
        echo json_encode($artikel);
    } else {
        // Artikel nicht gefunden
        http_response_code(404);
        echo json_encode(['error' => 'Artikel nicht gefunden']);
    }
} else{
    // wenn keine ID übergeben wird
    $sql = "SELECT * FROM produkt";
    $result = $conn->query($sql);

    // alle artikel abrufen
    $artikelListe = array();
    while($row = $result->fetch_assoc()){
        $artikelListe [] = $row;
    }
    // $artikelListe = $result->fetchAll(fetch_assoc);

    if ($artikelListe){
        echo json_encode($artikelListe);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Keine Artikel gefunden']);
    }
}

?>