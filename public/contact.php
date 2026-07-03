<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['type']) || !isset($data['data']) || !is_array($data['data'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request payload."]);
    exit;
}

$type = trim((string) $data['type']);
$formData = $data['data'];

function cleanField(array $data, string $key, string $fallback = 'N/A'): string {
    $value = trim((string) ($data[$key] ?? ''));
    if ($value === '') {
        $value = $fallback;
    }

    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function renderField(string $label, string $value): string {
    return '<div class="field"><span class="label">' . $label . '</span><div class="value">' . $value . '</div></div>';
}

function generateEmailTemplate(array $data): string {
    $name = cleanField($data, 'name', '');
    $email = cleanField($data, 'email', '');
    $company = cleanField($data, 'company');
    $role = cleanField($data, 'role');
    $interest = cleanField($data, 'interest');
    $product = cleanField($data, 'product');
    $appointmentDate = cleanField($data, 'appointmentDate');
    $appointmentTime = cleanField($data, 'appointmentTime');
    $message = nl2br(cleanField($data, 'message', 'No message provided.'));

    return '<!DOCTYPE html>' .
        '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' .
        '<style>' .
        'body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #071629; color: #1f2937; }' .
        '.wrapper { max-width: 680px; margin: 0 auto; border-radius: 18px; overflow: hidden; box-shadow: 0 28px 80px rgba(0,0,0,0.28); }' .
        '.header { background: linear-gradient(135deg, #12386e 0%, #128d9c 52%, #62b63f 100%); color: #fff; padding: 38px 30px; }' .
        '.header h1 { margin: 0; font-size: 28px; line-height: 1.2; }' .
        '.header p { margin: 12px 0 0; color: rgba(255,255,255,0.78); }' .
        '.content { background: #fff; padding: 30px; }' .
        '.field { margin-bottom: 14px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #19b7bd; border-radius: 12px; }' .
        '.label { display: block; margin-bottom: 7px; color: #0d5fb8; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }' .
        '.value { color: #111827; font-size: 15px; line-height: 1.6; }' .
        '.footer { background: #f8fafc; padding: 20px 30px; color: #475569; font-size: 13px; border-top: 1px solid #e2e8f0; }' .
        '</style></head><body>' .
        '<div class="wrapper">' .
        '<div class="header"><h1>New CornerstoneOS Website Request</h1><p>CRM | HRIS | PAYROLL enquiry from the landing page</p></div>' .
        '<div class="content">' .
        renderField('Full Name', $name) .
        renderField('Email Address', '<a href="mailto:' . $email . '" style="color:#0d5fb8;text-decoration:none;">' . $email . '</a>') .
        renderField('Company', $company) .
        renderField('Role', $role) .
        renderField('Request Type', $interest) .
        renderField('Product Interest', $product) .
        renderField('Preferred Date', $appointmentDate) .
        renderField('Preferred Time', $appointmentTime) .
        renderField('Message', $message) .
        '</div>' .
        '<div class="footer">Reply to the sender at: ' . $email . '</div>' .
        '</div>' .
        '</body></html>';
}

if ($type !== 'contact') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Unknown form type."]);
    exit;
}

$name = trim((string) ($formData['name'] ?? ''));
$email = trim((string) ($formData['email'] ?? ''));

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name and email are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please provide a valid email address."]);
    exit;
}

$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$interest = trim((string) ($formData['interest'] ?? 'Contact Request'));
$safeInterest = preg_replace('/[\r\n]+/', ' ', $interest);

$to = 'dhisanan@gmail.com';
$subject = 'CornerstoneOS ' . $safeInterest . ' from ' . $safeName;
$body = generateEmailTemplate($formData);

$headers = [];
$headers[] = 'From: noreply@cornerstone.com';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send message. Please try again later."]);
    exit;
}

echo json_encode(["status" => "success", "message" => "Message sent successfully."]);
