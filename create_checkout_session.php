<?php
require 'stripe-php-master/init.php'; // Stripe-Bibliothek einbinden

// Stripe API-Schlüssel setzen
\Stripe\Stripe::setApiKey('sk_test_51QU6m7KaPZs8yxC8hTuIhPzKVhakTo0PmbX6x73EA2aS3wu2UhZzDJSnX0EW2KDtFy8ILGBOGwXBH2pMsZGfwKYP00ZxQ4tizA');

// Empfange Daten aus der Anfrage (z. B. Artikel im Warenkorb)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Artikel für die Stripe-Session vorbereiten
$line_items = [];
foreach ($data['cart'] as $item) {
    $line_items[] = [
        'price_data' => [
            'currency' => 'eur',
            'product_data' => [
                'name' => $item['Produkttitel'],
            ],
            'unit_amount' => $item['PreisBrutto'] * 100, // Preis in Cent
        ],
        'quantity' => $item['amount'],
    ];
}

// Stripe-Checkout-Session erstellen
try {
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => $line_items,
        'mode' => 'payment',
        'success_url' => 'https://ivm108.informatik.htw-dresden.de/ewa/g33/WebShop/success.php?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => 'https://ivm108.informatik.htw-dresden.de/ewa/g33/WebShop/cancel.php',
    ]);
    echo json_encode(['id' => $session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
