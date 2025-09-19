<?php
header('Content-Type: application/json');
include("conexion.php");
session_start();

$id_usuario = $_SESSION['id_usuario'] ?? 0;

$datos = json_decode(file_get_contents("php://input"), true);
$query = $datos['query'] ?? '';

if (!$query) {
    echo json_encode(["error" => "No se recibió texto para búsqueda."]);
    exit;
}

$search = "%{$query}%";

$sql = "SELECT r.id_restaurante, r.nombre, r.descripcion, r.calificacion,
        IF(f.id_favorito IS NULL, 0, 1) AS tiene_favorito
        FROM restaurantes r
        LEFT JOIN favoritos f ON r.id_restaurante = f.id_restaurante AND f.id_usuario = ?
        WHERE r.nombre LIKE ? OR r.descripcion LIKE ?
        LIMIT 20";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Error en prepare: " . $conexion->error]);
    exit;
}

$stmt->bind_param("iss", $id_usuario, $search, $search);
$stmt->execute();

$result = $stmt->get_result();
$restaurantes = [];

while ($row = $result->fetch_assoc()) {
    $restaurantes[] = $row;
}

echo json_encode($restaurantes);
