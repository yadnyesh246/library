<?php

function sendStudentApprovalEmail(string $toEmail, string $studentName = "Student"): bool
{
    if (empty(trim($toEmail))) {
        return false;
    }

    $subject = "Your library account has been approved";
    $message = "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;'>
            <h2 style='color: #0f172a;'>Account Approved</h2>
            <p>Hello " . htmlspecialchars($studentName, ENT_QUOTES, 'UTF-8') . ",</p>
            <p>Your student account has been approved by the admin.</p>
            <p>You can now log in and access the library services.</p>
            <p>Thank you.</p>
        </body>
        </html>
    ";

    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: yadnyeshpawar09@gmail.com",
        "Reply-To: yadnyeshpawar09@gmail.com"
    ];

    return mail($toEmail, $subject, $message, implode("\r\n", $headers));
}
