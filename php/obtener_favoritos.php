<?php
header('Content-Type: application/json');
session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['error' => 'No autenticado']);
    exit;
}
$id_usuario = $_SESSION['id_usuario'];
include 'conexion.php';

// Recibir lat y lng enviados en POST JSON
$input = json_decode(file_get_contents('php://input'), true);
$lat = isset($input['lat']) ? floatval($input['lat']) : null;
$lng = isset($input['lng']) ? floatval($input['lng']) : null;

if ($lat === null || $lng === null) {
    echo json_encode(['error' => 'Faltan parámetros de ubicación']);
    exit;
}

// Fórmula Haversine para calcular distancia en km
$sql = "
    SELECT r.id_restaurante, r.nombre, r.descripcion, r.lat, r.lng, r.calificacion,
    1 AS tiene_favorito,
    (6371 * acos(
        cos(radians(?)) * cos(radians(r.lat)) * cos(radians(r.lng) - radians(?)) +
        sin(radians(?)) * sin(radians(r.lat))
    )) AS distancia
    FROM favoritos f
    JOIN restaurantes r ON r.id_restaurante = f.id_restaurante
    WHERE f.id_usuario = ?
    ORDER BY distancia ASC
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("dddi", $lat, $lng, $lat, $id_usuario);
$stmt->execute();
$res = $stmt->get_result();

$lista = [];
while ($row = $res->fetch_assoc()) $lista[] = $row;
echo json_encode($lista);
