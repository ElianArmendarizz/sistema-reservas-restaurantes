<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
include("conexion.php");
session_start();

try {
    $id_usuario = $_SESSION['id_usuario'] ?? 0;

    $datos = json_decode(file_get_contents("php://input"), true);
    $lat = $datos["lat"] ?? null;
    $lng = $datos["lng"] ?? null;

    file_put_contents("debug_log.txt",
        "📥 POST → lat=$lat | lng=$lng | user=$id_usuario | " . date("Y-m-d H:i:s") . "\n",
        FILE_APPEND
    );

    if (!$lat || !$lng) {
        echo json_encode([
            "error" => "Ubicación no recibida.",
            "debug" => ["lat" => $lat, "lng" => $lng, "body" => $datos]
        ]);
        exit;
    }

    $query = "
        SELECT 
            r.id_restaurante,
            r.nombre,
            r.descripcion,
            r.lat,
            r.lng,
            (6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(r.lat)) *
                COS(RADIANS(r.lng) - RADIANS(?)) +
                SIN(RADIANS(?)) * SIN(RADIANS(r.lat))
            )) AS distancia,
            IF(f.id_favorito IS NULL, 0, 1) AS tiene_favorito
        FROM restaurantes r
        LEFT JOIN favoritos f ON f.id_restaurante = r.id_restaurante AND f.id_usuario = ?
        HAVING distancia < 20 -- Filtrar a 20 km
        ORDER BY distancia ASC
        LIMIT 10
    ";

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        echo json_encode([
            "error"   => "Falló prepare()",
            "detalle" => $conexion->error
        ]);
        exit;
    }

    $stmt->bind_param("dddi", $lat, $lng, $lat, $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $restaurantes = [];
    while ($row = $result->fetch_assoc()) $restaurantes[] = $row;

    file_put_contents("debug_log.txt",
        "📤 RESULTADOS → " . count($restaurantes) . "\n",
        FILE_APPEND
    );

    echo json_encode($restaurantes);

} catch (Exception $e) {
    echo json_encode([
        "error"     => "Error en el servidor.",
        "exception" => $e->getMessage()
    ]);
}
?>
