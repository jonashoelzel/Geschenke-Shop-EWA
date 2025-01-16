<?php
require 'vendor/autoload.php'; // Stripe-Bibliothek einbinden

// Stripe API-Schlüssel setzen
\Stripe\Stripe::setApiKey('sk_test_51QU6m7KaPZs8yxC8hTuIhPzKVhakTo0PmbX6x73EA2aS3wu2UhZzDJSnX0EW2KDtFy8ILGBOGwXBH2pMsZGfwKYP00ZxQ4tizA');

// Holen der Session-ID
$session_id = $_GET['session_id'] ?? null;

if ($session_id) {
    try {
        $session = \Stripe\Checkout\Session::retrieve($session_id);
        $customer = \Stripe\Customer::retrieve($session->customer);

        echo "<h1>Vielen Dank für Ihre Bestellung!</h1>";
        echo "<p>Ihre Zahlung wurde erfolgreich verarbeitet.</p>";
        echo "<p>Bestell-ID: " . htmlspecialchars($session->id) . "</p>";
        echo "<p>Kundenname: " . htmlspecialchars($customer->name) . "</p>";
        echo "<p>Email: " . htmlspecialchars($customer->email) . "</p>";
    } catch (Exception $e) {
        echo "<h1>Fehler!</h1>";
        echo "<p>Die Bestellung konnte nicht gefunden werden.</p>";
    }
} else {
    echo "<h1>Fehler!</h1>";
    echo "<p>Keine gültige Session-ID vorhanden.</p>";
}
