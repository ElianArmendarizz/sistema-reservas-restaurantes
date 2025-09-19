<?php
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No has iniciado sesión."]);
    exit;
}

// Devolver datos del usuario
echo json_encode([
    "id_usuario" => $_SESSION['id_usuario'],
    "nombre" => $_SESSION['nombre']
]);
