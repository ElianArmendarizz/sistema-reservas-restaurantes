<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$email = $_POST['email'] ?? '';
$nueva = $_POST['nueva_pass'] ?? '';

if (!$email || !$nueva) {
    echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

$nueva_hash = password_hash($nueva, PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET contraseña_hash = ? WHERE correo_electronico = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $nueva_hash, $email);

if ($stmt->execute()) {
    echo json_encode(['exito' => true]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al actualizar']);
}
