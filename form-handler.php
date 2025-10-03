<?php
// SECURITY: This form handler has been disabled for security reasons
// Originally allowed unrestricted POST data with no validation
// Contact administrator to re-enable with proper security measures

header('Content-Type: application/json');
http_response_code(503);
echo json_encode([
    'error' => 'Form submission temporarily disabled for security',
    'message' => 'This form handler has been disabled to prevent security vulnerabilities.',
    'contact' => 'Please contact the site administrator for assistance.'
]);
exit;

// DISABLED CODE BELOW - Original vulnerable implementation
/*
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Add metadata
$submission = [
    'id' => uniqid(),
    'timestamp' => date('c'),
    'type' => $data['form_type'] ?? 'unknown',
    'data' => $data,
    'status' => 'new'
];

// Read existing submissions
$file = 'submissions.json';