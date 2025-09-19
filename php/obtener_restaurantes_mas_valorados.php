<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
include("conexion.php");
session_start();

try {
    $id_usuario = $_SESSION['id_usuario'] ?? 0;

    $query = "
        SELECT 
            r.id_restaurante,
            r.nombre,
            r.descripcion,
            r.lat,
            r.lng,
            r.calificacion,
            IF(f.id_favorito IS NULL, 0, 1) AS tiene_favorito
        FROM restaurantes r
        LEFT JOIN favoritos f ON f.id_restaurante = r.id_restaurante AND f.id_usuario = ?
        ORDER BY r.calificacion DESC
        LIMIT 10
    ";

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        echo json_encode([
            "error" => "Error en prepare()",
            "detalle" => $conexion->error
        ]);
        exit;
    }

    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $restaurantes = [];
    while ($row = $result->fetch_assoc()) {
        $restaurantes[] = $row;
    }

    echo json_encode($restaurantes);

} catch (Exception $e) {
    echo json_encode([
        "error" => "Error en el servidor.",
        "exception" => $e->getMessage()
    ]);
}
?>
