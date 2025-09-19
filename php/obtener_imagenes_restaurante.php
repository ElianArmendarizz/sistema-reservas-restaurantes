<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No has iniciado sesión."]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id_restaurante = $input["id_restaurante"] ?? null;

if (!$id_restaurante) {
    echo json_encode(["error" => "ID del restaurante no proporcionado."]);
    exit;
}

include("conexion.php");

$stmt = $conexion->prepare("SELECT url_imagen, descripcion_imagen, es_principal FROM imagenes_restaurante WHERE id_restaurante = ?");
$stmt->bind_param("i", $id_restaurante);
$stmt->execute();
$result = $stmt->get_result();

$imagenes = [];
while ($row = $result->fetch_assoc()) {
    $imagenes[] = $row;
}

echo json_encode($imagenes);

$stmt->close();
$conexion->close();
?>