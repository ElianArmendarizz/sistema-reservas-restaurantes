<?php
header('Content-Type: application/json');
include 'conexion.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id_restaurante'] ?? null;

if (!$id) { echo json_encode(['error'=>'Falta id_restaurante']); exit; }

$sql = "SELECT dia_semana, 
               DATE_FORMAT(hora_apertura,'%H:%i') AS apertura,
               DATE_FORMAT(hora_cierre,'%H:%i') AS cierre
        FROM horarios_restaurante
        WHERE id_restaurante = ?
        ORDER BY FIELD(dia_semana,
                'Domingo','Lunes','Martes','Miércoles',
                'Jueves','Viernes','Sábado')";

$stmt = $conexion->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();

$datos = [];
while ($row = $res->fetch_assoc()) $datos[] = $row;

echo json_encode($datos);
?>