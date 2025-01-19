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

// kunden-ID aus dem GET-Parameter lesen
$kundenId = isset($_GET['id']) ? $_GET['id'] : null;

if($kundenId){
    // Prüfen, ob die ID exakt 5 Zeichen lang ist und nur aus Ziffern besteht
    if (!preg_match('/^\d{5}$/', $kundenId)) {
        http_response_code(400); // 400 Bad Request
        echo json_encode(['error' => 'Ungültige Artikel-ID. ID muss genau 5 Ziffern enthalten.']);
        exit;
    }

    // SQL-Abfrage
    $sql = "SELECT * FROM kunde WHERE kundenID = $kundenId";
    $result = $conn->query($sql);

    $kunde = $result->fetch_assoc();

    if ($kunde) {
        // Artikel als JSON zurückgeben
        echo json_encode($kunde);
    } else {
        // Artikel nicht gefunden
        http_response_code(404);
        echo json_encode(['error' => 'Nutzer nicht gefunden']);
    }
} else{
    // wenn keine ID übergeben wird
    $sql = "SELECT * FROM kunde";
    $result = $conn->query($sql);

    // alle artikel abrufen
    $kundenListe = array();
    while($row = $result->fetch_assoc()){
        $kundenListe [] = $row;
    }
    // $artikelListe = $result->fetchAll(fetch_assoc);

    if ($kundenListe){
        echo json_encode($kundenListe);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Keine Nutzer gefunden']);
    }
}

?>