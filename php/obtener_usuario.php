<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No has iniciado sesión."]);
    exit;
}

echo json_encode([
    "id_usuario" => $_SESSION['id_usuario'],
    "nombre" => $_SESSION['nombre'] ?? "Usuario"
]);
