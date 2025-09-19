<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['id_restaurante'])) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos']);
    exit;
}

$id_restaurante = (int)$input['id_restaurante'];

include 'conexion.php';

try {
    $stmt = $conexion->prepare("DELETE FROM favoritos WHERE id_usuario = ? AND id_restaurante = ?");
    $stmt->bind_param("ii", $id_usuario, $id_restaurante);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
