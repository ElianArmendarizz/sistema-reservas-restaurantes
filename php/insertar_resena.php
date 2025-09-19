<?php
header('Content-Type: application/json');
require_once 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validaciones básicas
if (empty($data['id_restaurante']) || !is_numeric($data['id_restaurante'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID de restaurante inválido']);
    exit;
}

if (empty($data['id_usuario']) || !is_numeric($data['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Debes iniciar sesión']);
    exit;
}

if (empty($data['calificacion']) || $data['calificacion'] < 1 || $data['calificacion'] > 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Calificación inválida']);
    exit;
}

$comentario = trim($data['comentario'] ?? '');
if (empty($comentario)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El comentario no puede estar vacío']);
    exit;
}

try {
    $stmt = $conexion->prepare(
        "INSERT INTO reseñas 
         (id_restaurante, id_usuario, calificacion, comentario, fecha_publicacion) 
         VALUES (?, ?, ?, ?, NOW())"
    );
    
    $stmt->bind_param(
        'iiis', 
        $data['id_restaurante'], 
        $data['id_usuario'], 
        $data['calificacion'], 
        $comentario
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>