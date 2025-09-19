<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get form data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If no JSON input, try form data
    if (!$input) {
        $input = $_POST;
    }
    
    // Add timestamp and unique ID
    $submission = [
        'id' => uniqid(),
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $input['form_type'] ?? 'unknown',
        'data' => $input,
        'status' => 'new'
    ];
    
    // File to store submissions
    $file = 'submissions.json';
    
    // Read existing data
    $submissions = [];
    if (file_exists($file)) {
        $existingData = file_get_contents($file);
        $submissions = json_decode($existingData, true) ?? [];
    }
    
    // Add new submission
    $submissions[] = $submission;
    
    // Save to file
    $result = file_put_contents($file, json_encode($submissions, JSON_PRETTY_PRINT));
    
    if ($result === false) {
        throw new Exception('Failed to save submission');
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Submission saved successfully',
        'id' => $submission['id']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>