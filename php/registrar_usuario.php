<?php
include("conexion.php");

// Recibir datos
$nombre = $_POST['nombre'] ?? '';
$correo = $_POST['correo'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$password = $_POST['password'] ?? '';

// Validaciones básicas
if (empty($nombre) || empty($correo) || empty($password)) {
    echo "Todos los campos obligatorios deben estar completos.";
    exit;
}

$passHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre_completo, correo_electronico, telefono, contraseña_hash) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $correo, $telefono, $passHash);

    if ($stmt->execute()) {
        echo "Registrado correctamente ✅";
    } else {
        echo "Error al registrar: " . $stmt->error;
    }

    $stmt->close();
    $conexion->close();
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), "Duplicate entry") !== false) {
        echo "Este correo ya está registrado ❌";
    } else {
        echo "Error inesperado: " . $e->getMessage();
    }
}
?>

