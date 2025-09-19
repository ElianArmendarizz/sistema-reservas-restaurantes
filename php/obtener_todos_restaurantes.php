<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
include("conexion.php");
session_start();

$id_usuario = $_SESSION['id_usuario'] ?? 0;

$sql = "
    SELECT r.id_restaurante,
           r.nombre,
           r.descripcion,
           r.lat,
           r.lng,
           r.calificacion,
           IF(f.id_favorito IS NULL, 0, 1) AS tiene_favorito
    FROM restaurantes r
    LEFT JOIN favoritos f
           ON f.id_restaurante = r.id_restaurante
          AND f.id_usuario     = ?
    ORDER BY r.nombre ASC
";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Error en prepare()", "detalle" => $conexion->error]);
    exit;
}

$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$res = $stmt->get_result();

$restaurantes = [];
while ($row = $res->fetch_assoc()) {
    $restaurantes[] = $row;
}

echo json_encode($restaurantes);
