<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";
$studentId = trim($_GET["studentId"] ?? "");

if ($studentId === "") {
    echo json_encode([]);
    exit();
}

try {
    $notifications = $db->bookRequests->find(
        [
            "studentId" => $studentId,
            "status" => "Rejected"
        ],
        ["sort" => ["processedAt" => -1]]
    );
    $data = [];

    foreach ($notifications as $notification) {
        $data[] = [
            "_id" => (string)$notification["_id"],
            "type" => "rejection",
            "bookTitle" => $notification["bookTitle"] ?? "",
            "status" => $notification["status"] ?? "Rejected",
            "rejectionReason" => $notification["rejectionReason"] ?? "No reason provided",
            "processedAt" => $notification["processedAt"] ?? ""
        ];
    }

    $issuedBooks = $db->issuedBooks->find([
        "studentId" => $studentId,
        "status" => "Issued"
    ]);
    $today = new DateTime(date("Y-m-d"));

    foreach ($issuedBooks as $issuedBook) {
        $returnDate = $issuedBook->returnDate ?? "";

        if (empty($returnDate)) {
            continue;
        }

        $dueDate = new DateTime($returnDate);

        if ($today <= $dueDate) {
            continue;
        }

        $lateDays = $dueDate->diff($today)->days;
        $fine = $lateDays * 10;

        $data[] = [
            "_id" => (string)$issuedBook->_id,
            "type" => "overdue",
            "bookTitle" => $issuedBook->bookTitle ?? "Book",
            "status" => "Overdue",
            "lateDays" => $lateDays,
            "fine" => $fine,
            "returnDate" => $returnDate,
            "message" => "Aapka charge incomplete hai. Har din ₹10 ke hisab se ab tak ₹{$fine} charge hai. Book jaldi return karein."
        ];
    }

    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
