<?php
$servidor = "localhost";
$usuario = "root"; // Usuario por defecto de XAMPP
$contrasena = ""; // Contraseña por defecto (vacía)
$basedatos = "directoaipiato"; // Cambia esto

$conexion = new mysqli($servidor, $usuario, $contrasena, $basedatos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Opcional: establecer el charset
$conexion->set_charset("utf8");
?>