<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'No logueado']);
    exit;
}

$idReservacion = intval($_POST['id_reservacion'] ?? 0);
$idUsuario     = intval($_SESSION['id_usuario']);

$sql = "UPDATE reservaciones
        SET estado = 'Confirmada'
        WHERE id_reservacion = ? AND id_usuario = ? AND estado = 'Pendiente'";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $idReservacion, $idUsuario);

if ($stmt->execute() && $stmt->affected_rows) {
    echo json_encode(['exito' => true]);
} else {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'No se pudo actualizar.',
        'error_sql' => $stmt->error,
        'affected_rows' => $stmt->affected_rows,
        'id_reservacion' => $idReservacion,
        'id_usuario_sesion' => $idUsuario,
    ]);
}
?>
