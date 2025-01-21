<?php
require_once('./stripe-php/init.php');

\Stripe\Stripe::setApiKey('sk_test_51QU6m7KaPZs8yxC8hTuIhPzKVhakTo0PmbX6x73EA2aS3wu2UhZzDJSnX0EW2KDtFy8ILGBOGwXBH2pMsZGfwKYP00ZxQ4tizA');  // Replace with your actual secret key

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$base_url = 'https://ivm108.informatik.htw-dresden.de/ewa/g33/Jonas/';
$success_url = $base_url . '?payment=success';
$cancel_url = $base_url . '?payment=cancelled';

// Prevent PHP errors from being output
error_reporting(0);

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $cartMap = $data['cartMap'];

    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => $data['lineItems'],
        'mode' => 'payment',
        'success_url' => $success_url . '&cart=' . $cartMap,
        'cancel_url' => $cancel_url . '&cart=' . $cartMap,
    ]);

    // Redirect to Stripe Checkout URL
    echo json_encode(['sessionId' => $checkout_session->id, 'redirect' => $checkout_session->url]);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
