<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once "../config/db.php";

try {
    $payments = $db->fineFund->find([], ["sort" => ["paidDate" => -1, "createdAt" => -1]]);
    $records = [];
    $totalCollected = 0;

    foreach ($payments as $payment) {
        $amount = (int)($payment->amount ?? 0);
        $totalCollected += $amount;

        $records[] = [
            "_id" => (string)$payment->_id,
            "studentId" => $payment->studentId ?? "",
            "studentName" => $payment->studentName ?? "",
            "bookTitle" => $payment->bookTitle ?? "",
            "amount" => $amount,
            "lateDays" => (int)($payment->lateDays ?? 0),
            "paidDate" => $payment->paidDate ?? ""
        ];
    }

    echo json_encode([
        "status" => "success",
        "totalCollected" => $totalCollected,
        "paymentCount" => count($records),
        "payments" => $records
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>