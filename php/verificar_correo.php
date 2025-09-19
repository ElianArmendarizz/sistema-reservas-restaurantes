<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$email = $_POST['email'] ?? '';

if (!$email) {
    echo json_encode(['existe' => false]);
    exit;
}

$sql = "SELECT id_usuario FROM usuarios WHERE correo_electronico = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode(['existe' => $result->num_rows > 0]);
