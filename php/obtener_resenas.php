<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';  // Ya hace la conexión y da $conexion

$id_restaurante = $_GET['id_restaurante'] ?? null;

if (!$id_restaurante || !is_numeric($id_restaurante)) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de restaurante inválido']);
    exit;
}

$mysqli = $conexion;  // Usa la conexión ya establecida

$mysqli->set_charset('utf8mb4');  // Para permitir tildes, emojis, etc.

$stmt = $mysqli->prepare(
    "SELECT r.id_reseña AS id_resena,
            r.comentario,
            r.calificacion,
            r.fecha_publicacion,
            u.nombre_completo AS usuario
     FROM reseñas r
     JOIN usuarios u ON u.id_usuario = r.id_usuario
     WHERE r.id_restaurante = ?
     ORDER BY r.fecha_publicacion DESC"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => $mysqli->error]);
    exit;
}

$stmt->bind_param('i', $id_restaurante);
$stmt->execute();

$result  = $stmt->get_result();
$resenas = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($resenas, JSON_UNESCAPED_UNICODE);

$stmt->close();
$mysqli->close();
?>
