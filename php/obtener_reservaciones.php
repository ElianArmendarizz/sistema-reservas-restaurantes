<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([]);
    exit;
}

require_once 'conexion.php';           //  tu archivo de conexión usual
$idUsuario = intval($_SESSION['id_usuario']);

$sql = "SELECT r.id_reservacion,
               rs.nombre       AS restaurante,
               DATE_FORMAT(r.fecha_reservacion, '%d/%m/%Y') AS fecha,
               DATE_FORMAT(r.hora_reservacion, '%H:%i')     AS hora,
               r.cantidad_personas                          AS personas
        FROM reservaciones r
        JOIN restaurantes rs ON rs.id_restaurante = r.id_restaurante
        WHERE r.id_usuario = ? AND r.estado = 'Pendiente'
        ORDER BY r.fecha_reservacion, r.hora_reservacion";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

$reservas = [];
while ($row = $result->fetch_assoc()) {
    $reservas[] = $row;
}
echo json_encode($reservas);
