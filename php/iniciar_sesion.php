<?php
session_start();
include("conexion.php");

// Activar excepciones para errores de MySQLi
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Recibir datos
$correo = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validar campos
if (empty($correo) || empty($password)) {
    echo "Por favor, complete todos los campos.";
    exit;
}

// Buscar al usuario
$stmt = $conexion->prepare("SELECT id_usuario, nombre_completo, contraseña_hash FROM usuarios WHERE correo_electronico = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "Este correo no está registrado ❌";
    exit;
}

$usuario = $result->fetch_assoc();

// Verificar contraseña
if (password_verify($password, $usuario['contraseña_hash'])) {
    // Guardar en sesión
    $_SESSION['id_usuario'] = $usuario['id_usuario'];
    $_SESSION['nombre'] = $usuario['nombre_completo'];

    echo "success";
} else {
    echo "La contraseña es incorrecta ❌";
}

$stmt->close();
$conexion->close();
