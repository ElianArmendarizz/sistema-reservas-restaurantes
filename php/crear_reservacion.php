<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No has iniciado sesión."]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

// Validar datos de entrada
$requiredFields = ['id_usuario', 'id_restaurante', 'fecha_reservacion', 'hora_reservacion', 'cantidad_personas'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        echo json_encode(["error" => "El campo $field es requerido."]);
        exit;
    }
}

include("conexion.php");

// Insertar la reservación
$stmt = $conexion->prepare("INSERT INTO reservaciones 
    (id_usuario, id_restaurante, fecha_reservacion, hora_reservacion, cantidad_personas) 
    VALUES (?, ?, ?, ?, ?)");

$stmt->bind_param("iissi", 
    $input['id_usuario'],
    $input['id_restaurante'],
    $input['fecha_reservacion'],
    $input['hora_reservacion'],
    $input['cantidad_personas']
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "id_reservacion" => $stmt->insert_id]);
} else {
    echo json_encode(["error" => "Error al crear la reservación: " . $conexion->error]);
}

$stmt->close();
$conexion->close();
?>