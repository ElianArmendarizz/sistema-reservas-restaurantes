<?php
header('Content-Type: application/json');
include 'conexion.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = isset($input["id_restaurante"]) ? intval($input["id_restaurante"]) : 0;
if (!$id) { echo json_encode(["error" => "Parámetro faltante."]); exit; }

$sql = "
  SELECT id_restaurante, nombre, descripcion, calificacion,
         precio_min, precio_max, telefono, direccion, lat, lng
  FROM restaurantes
  WHERE id_restaurante = ?
  LIMIT 1
";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
  echo json_encode($row);
} else {
  echo json_encode(["error" => "Restaurante no encontrado."]);
}
