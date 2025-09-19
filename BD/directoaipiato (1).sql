-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-06-2025 a las 04:58:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `directoaipiato`
--
CREATE DATABASE IF NOT EXISTS `directoaipiato` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `directoaipiato`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_restaurante` int(11) NOT NULL,
  `fecha_agregado` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios_restaurante`
--

CREATE TABLE `horarios_restaurante` (
  `id_horario` int(11) NOT NULL,
  `id_restaurante` int(11) NOT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') DEFAULT NULL,
  `hora_apertura` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horarios_restaurante`
--

INSERT INTO `horarios_restaurante` (`id_horario`, `id_restaurante`, `dia_semana`, `hora_apertura`, `hora_cierre`) VALUES
(1, 1, 'Lunes', '07:00:00', '22:00:00'),
(2, 1, 'Martes', '07:00:00', '22:00:00'),
(3, 1, 'Miércoles', '07:00:00', '22:00:00'),
(4, 1, 'Jueves', '07:00:00', '22:00:00'),
(5, 1, 'Viernes', '07:00:00', '23:00:00'),
(6, 1, 'Sábado', '08:00:00', '23:00:00'),
(7, 1, 'Domingo', '08:00:00', '21:00:00'),
(8, 2, 'Lunes', '11:00:00', '21:00:00'),
(9, 2, 'Martes', '11:00:00', '21:00:00'),
(10, 2, 'Miércoles', '11:00:00', '21:00:00'),
(11, 2, 'Jueves', '11:00:00', '22:00:00'),
(12, 2, 'Viernes', '11:00:00', '22:00:00'),
(13, 2, 'Sábado', '12:00:00', '23:00:00'),
(14, 2, 'Domingo', '12:00:00', '21:00:00'),
(15, 3, 'Lunes', '09:00:00', '20:00:00'),
(16, 3, 'Martes', '09:00:00', '20:00:00'),
(17, 3, 'Miércoles', '09:00:00', '20:00:00'),
(18, 3, 'Jueves', '09:00:00', '21:00:00'),
(19, 3, 'Viernes', '09:00:00', '21:00:00'),
(20, 3, 'Sábado', '10:00:00', '21:00:00'),
(21, 3, 'Domingo', '10:00:00', '19:00:00'),
(22, 4, 'Lunes', '10:00:00', '22:00:00'),
(23, 4, 'Martes', '10:00:00', '22:00:00'),
(24, 4, 'Miércoles', '10:00:00', '22:00:00'),
(25, 4, 'Jueves', '10:00:00', '22:00:00'),
(26, 4, 'Viernes', '10:00:00', '23:00:00'),
(27, 4, 'Sábado', '10:00:00', '23:00:00'),
(28, 4, 'Domingo', '10:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_restaurante`
--

CREATE TABLE `imagenes_restaurante` (
  `id_imagen` int(11) NOT NULL,
  `id_restaurante` int(11) NOT NULL,
  `url_imagen` varchar(455) NOT NULL,
  `descripcion_imagen` varchar(150) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_restaurante`
--

INSERT INTO `imagenes_restaurante` (`id_imagen`, `id_restaurante`, `url_imagen`, `descripcion_imagen`, `es_principal`) VALUES
(49, 1, 'https://i.pinimg.com/736x/cf/a8/3c/cfa83c6000fd3fb42d7a9edfa1b85c6d.jpg', 'Fachada principal de La Parroquia', 1),
(50, 1, 'https://lacarrerapanamericana.com.mx/wp-content/uploads/2021/07/Cafe-de-Veracruz-By-Rodrigo-Hidalgo-1024x738.jpg', 'Interior y clientes disfrutando café', 0),
(51, 1, 'https://www.viajabonito.mx/wp-content/uploads/2021/06/cafe-la-parroquia-veracruz-12.jpg', 'platillo de La Parroquia1', 0),
(52, 1, 'https://i.ytimg.com/vi/pyfDuad7skU/maxresdefault.jpg', 'platillo de La Parroquia2', 0),
(53, 1, 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/gran-cafe-de-la-parroquia-an-institution-of-veracruz-mahokai-fotoartist.jpg', 'platillo de La Parroquia3', 0),
(54, 2, 'https://lh5.googleusercontent.com/p/AF1QipNKKyN3qUbIOo5uzDZGqBPWlJeGlNCkg3c2GXHX', 'Fachada de El Bayo', 1),
(55, 2, 'https://media-cdn.tripadvisor.com/media/photo-s/09/f6/5f/a0/el-bayo.jpg', 'Interior y clientes disfrutando', 0),
(56, 2, 'https://tb-static.uber.com/prod/image-proc/processed_images/ee0df278bcb98f0b97d3df5a86919c18/fb86662148be855d931b37d6c1e5fcbe.jpeg', 'platillo1', 0),
(57, 2, 'https://pbs.twimg.com/media/Go_rw_1W8AAKSfS?format=jpg&name=large', 'platillo2', 0),
(58, 2, 'https://tb-static.uber.com/prod/image-proc/processed_images/70740963efc7d9cfcf14dab433fbc40c/9e31c708e4cf73b6e3ea1bd4a9b6e16b.jpeg', 'platillo3', 0),
(59, 3, 'https://media-cdn.tripadvisor.com/media/photo-s/0a/ce/ba/53/el-cacharrito.jpg', 'Fachada de El Cacharrito', 1),
(60, 3, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/74/36/b3/photo1jpg.jpg?w=900&h=500&s=1', 'Interior y clientes disfrutando', 0),
(61, 3, 'https://elcacharrito.com/img/slider/DSC_7629-Edit-Edit-compressor.jpg', 'platillo1', 0),
(62, 3, 'https://www.elcacharrito.com/img/slider/DSC_7653-Edit-compressor.jpg', 'platillo2', 0),
(63, 3, 'https://www.elcacharrito.com/img/slider/DSC_7619-Edit-Edit-compressor.jpg', 'platillo3', 0),
(64, 4, 'https://xeu.mx/contenidos/imagenes/noticias/standard/2021/04/1152255.jpg', 'Fachada de Los Portales', 1),
(65, 4, 'https://www.rtv.org.mx/masnoticias/wp-content/uploads/sites/13/2018/04/Los-Portales3.jpg', 'Interior y clientes disfrutando', 0),
(66, 4, 'https://www.zonaturistica.com/files/atractivos/441/A4_441.jpg', 'platillo1', 0),
(67, 4, 'https://aguapasada.wordpress.com/wp-content/uploads/2012/02/veracruz-portales-lerdo-mr-joe-skyscrapercity-080702.jpg', 'platillo2', 0),
(68, 4, 'https://pbs.twimg.com/media/FEJTlhGVkAcEz2t.jpg', 'platillo3', 0),
(69, 5, 'https://menuacapulco.com/wp-content/uploads/2021/05/dsc4795.jpg', 'Fachada de La Casa de la Pasta', 1),
(70, 5, 'https://hablabiendeaca.com/images/archivos/1654070620196402b0.jpg', 'Interior y clientes disfrutando', 0),
(71, 5, 'https://i0.wp.com/menuacapulco.com/wp-content/uploads/2021/05/dsc4768.jpg?fit=1200%2C797&ssl=1', 'platillo1', 0),
(72, 5, 'https://menuacapulco.com/wp-content/uploads/2021/05/dsc4725.jpg', 'platillo2', 0),
(73, 6, 'https://scontent.fver1-1.fna.fbcdn.net/v/t39.30808-6/432784536_412205261412628_8552692560500180606_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=M1fOZxMH2QIQ7kNvwHJ1wf4&_nc_oc=AdmWbL5rIaYOGkYfFtE4CeZfLIyBFdFQ9UcsmqrqK1GuY-K_fbcDan4WpVVHaQ55By_rlU1igX6vue4swFvEHJvn&_nc_zt=23&_nc_ht=scontent.fver1-1.fna&_nc_gid=f_U1qL1xt6ibP9X_JnhE_A&oh=00_AfM9k08RoKesBGiw-yHQtCryG0G_LhevuE8N7UVOwxDw3Q&oe=685ABB78', 'Fachada de El Rincón Jarocho', 1),
(74, 6, 'https://media-cdn.tripadvisor.com/media/photo-s/09/f6/5f/a0/el-bayo.jpg', 'Interior y clientes disfrutando', 0),
(75, 6, 'https://lh3.googleusercontent.com/p/AF1QipN0DiQIwjf600Z6sOVs35s4Vto22P0s6Badpnf7=s680-w680-h510-rw', 'platillo1', 0),
(76, 6, 'https://lh3.googleusercontent.com/p/AF1QipOX8nWCk2aSb3hpK0s9kn0Biwh0NdGmZi9d3h2c=s680-w680-h510-rw', 'platillo2', 0),
(77, 6, 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrnqWxEaj9mQuJAp2nE5e5T2MEGUZP_g1MyEl7wasZLymqJMq7dWt2NLFIMi7A37bnhZZh91HbvbQyCn9eh9OsfLnDx4L9z2km5ZFXukfafRfg0umP1uWi5dN5inxqCPbpic5y4=s680-w680-h510-rw', 'platillo3', 0),
(78, 7, 'https://lh5.googleusercontent.com/p/AF1QipNKKyN3qUbIOo5uzDZGqBPWlJeGlNCkg3c2GXHX', 'Fachada de El Bayo', 1),
(79, 7, 'https://media-cdn.tripadvisor.com/media/photo-s/09/f6/5f/a0/el-bayo.jpg', 'Interior y clientes disfrutando', 0),
(80, 7, 'https://tb-static.uber.com/prod/image-proc/processed_images/ee0df278bcb98f0b97d3df5a86919c18/fb86662148be855d931b37d6c1e5fcbe.jpeg', 'platillo1', 0),
(81, 7, 'https://pbs.twimg.com/media/Go_rw_1W8AAKSfS?format=jpg&name=large', 'platillo2', 0),
(82, 7, 'https://tb-static.uber.com/prod/image-proc/processed_images/70740963efc7d9cfcf14dab433fbc40c/9e31c708e4cf73b6e3ea1bd4a9b6e16b.jpeg', 'platillo3', 0),
(83, 8, 'https://latrattoria.com.mx/wp-content/uploads/2022/05/1/21.jpg', 'Fachada de La Trattoria', 1),
(84, 8, 'https://latrattoria.com.mx/wp-content/uploads/2022/06/PHOTO-2022-06-08-13-21-57-1.jpg', 'Interior y clientes disfrutando', 0),
(85, 8, 'https://latrattoria.com.mx/wp-content/uploads/2022/06/cuadrada-correccion.jpeg', 'platillo1', 0),
(86, 8, 'https://latrattoria.com.mx/wp-content/uploads/2022/06/cuadrada-correccion2-1.jpeg', 'platillo2', 0),
(87, 8, 'https://latrattoria.com.mx/wp-content/uploads/2022/06/home3-opt.jpeg', 'platillo3', 0),
(88, 9, 'https://porton.com.mx/wp-content/uploads/2023/11/porton_sucursal_villahermosa_5-768x768.jpg', 'Fachada de El Portón del Mar', 1),
(89, 9, 'https://porton.com.mx/wp-content/uploads/2023/11/Porton-Huevos-Motul.jpg', 'platillo1', 0),
(90, 9, 'https://porton.com.mx/wp-content/uploads/2023/11/Porton-Pozole.jpg', 'platillo2', 0),
(91, 9, 'https://porton.com.mx/wp-content/uploads/2023/11/Porton-Parrillada-NorteA.jpg', 'platillo3', 0),
(92, 10, 'https://img.atlasobscura.com/rIvedG_RW93Ir9UGI6UwIe6MUsde8bldYPUaFh3OMf0/rt:fit/w:1200/q:80/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy8yM2Rj/YjFlYi02NTQ0LTQ3/M2MtYmFiMi0wOThj/ZDc1N2M5MTM1NzZm/ZDlkMDNhMzk3M2Q2/ZDZfaGFiICgzKS5q/cGc.jpg', 'Fachada de Café La Habana', 1),
(93, 10, 'https://gourmandmexico.com/wp-content/uploads/2015/09/cafe-habana-salon.jpg', 'Interior y clientes disfrutando', 0),
(94, 10, 'https://mxc.com.mx/wp-content/uploads/2014/07/cafe-la-habana.jpeg', 'platillo1', 0),
(95, 10, 'https://img.local.mx/2019/02/cafe-la-habana-3.jpg', 'platillo2', 0),
(96, 10, 'https://media-cdn.tripadvisor.com/media/photo-s/17/93/6b/74/dsc-8086-largejpg.jpg', 'platillo3', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservaciones`
--

CREATE TABLE `reservaciones` (
  `id_reservacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_restaurante` int(11) NOT NULL,
  `fecha_reservacion` date NOT NULL,
  `hora_reservacion` time NOT NULL,
  `cantidad_personas` int(11) NOT NULL,
  `estado` enum('Pendiente','Confirmada','Cancelada','Completada') DEFAULT 'Pendiente',
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id_reseña` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_restaurante` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `calificacion` decimal(2,1) DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurantes`
--

CREATE TABLE `restaurantes` (
  `id_restaurante` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `calificacion` decimal(2,1) DEFAULT NULL,
  `ambiente` varchar(50) DEFAULT NULL,
  `zona` varchar(50) DEFAULT NULL,
  `precio_min` decimal(10,2) DEFAULT NULL,
  `precio_max` decimal(10,2) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `acepta_amex` tinyint(1) DEFAULT 0,
  `acepta_mastercard` tinyint(1) DEFAULT 0,
  `acepta_visa` tinyint(1) DEFAULT 0,
  `direccion` varchar(250) DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `restaurantes`
--

INSERT INTO `restaurantes` (`id_restaurante`, `nombre`, `descripcion`, `calificacion`, `ambiente`, `zona`, `precio_min`, `precio_max`, `telefono`, `acepta_amex`, `acepta_mastercard`, `acepta_visa`, `direccion`, `lat`, `lng`) VALUES
(1, 'La Parroquia', 'Restaurante tradicional famoso por su café lechero.', 4.6, 'Familiar', 'Veracruz Puerto', 80.00, 250.00, '2299324567', 1, 1, 1, 'Av. Independencia 117, Centro, Veracruz', 19.1950220, -96.1348500),
(2, 'El Bayo', 'Especialidad en mariscos y cocteles frescos.', 4.3, 'Casual', 'Veracruz Puerto', 90.00, 300.00, '2299182736', 0, 1, 1, 'Av. Miguel Alemán 321, Veracruz', 18.9847500, -95.9709400),
(3, 'El Cacharrito', 'Comida casera veracruzana con buen precio.', 4.0, 'Informal', 'Veracruz Puerto', 60.00, 200.00, '2299341122', 0, 0, 1, 'Calle Montesinos 33, Veracruz', 19.1423000, -96.1078000),
(4, 'Los Portales', 'Comida típica y mariscos frescos en ambiente familiar.', 4.2, 'Familiar', 'Veracruz Puerto', 100.00, 350.00, '2299123456', 1, 1, 1, 'Av. 20 de Noviembre 15, Veracruz', 19.1094300, -96.4429400),
(5, 'La Casa de la Pasta', 'Pasta y comida italiana con toque veracruzano.', 4.1, 'Casual', 'Veracruz Puerto', 120.00, 300.00, '2299456789', 1, 1, 1, 'Callejón del Diamante 4, Veracruz', 19.1809500, -96.1429000),
(6, 'El Rincón Jarocho', 'Platillos típicos veracruzanos con música en vivo.', 4.5, 'Tradicional', 'Veracruz Puerto', 130.00, 400.00, '2299988776', 1, 1, 0, 'Calle de las Flores 123, Veracruz', 19.0919400, -96.1886100),
(7, 'Mariscos La Costa', 'Ceviches y mariscos frescos frente al malecón.', 4.4, 'Informal', 'Veracruz Puerto', 110.00, 320.00, '2299223344', 0, 1, 1, 'Malecón 45, Veracruz', 22.2860500, -98.0401300),
(8, 'La Trattoria', 'Restaurante italiano con excelente ambiente y vinos.', 4.3, 'Elegante', 'Veracruz Puerto', 200.00, 500.00, '2299334422', 1, 1, 1, 'Av. Independencia 233, Veracruz', 19.1809500, -96.1429000),
(9, 'El Portón del Mar', 'Especialidad en pescados y mariscos frescos.', 4.2, 'Casual', 'Veracruz Puerto', 140.00, 380.00, '2299001122', 0, 1, 1, 'Callejón de la Paz 22, Veracruz', 19.6752800, -97.0347200),
(10, 'Café La Habana', 'Café, postres y snacks en ambiente tranquilo.', 4.0, 'Cafetería', 'Veracruz Puerto', 60.00, 150.00, '2299112233', 1, 0, 1, 'Av. 5 de Mayo 101, Veracruz', 19.1809500, -96.1429000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contraseña_hash` varchar(255) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_electronico`, `telefono`, `contraseña_hash`, `fecha_registro`) VALUES
(17, 'Elian Shair Armendariz Puch', 'elianarmendariz@gmail.com', '9811682698', '$2y$10$EVLD9y6GMT.UP8enL8Sv3uswqQ5r/Gfkk6RbfXJE3MGRrwHkfZRmu', '2025-06-18 19:12:22');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`,`id_restaurante`),
  ADD KEY `id_restaurante` (`id_restaurante`);

--
-- Indices de la tabla `horarios_restaurante`
--
ALTER TABLE `horarios_restaurante`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `id_restaurante` (`id_restaurante`);

--
-- Indices de la tabla `imagenes_restaurante`
--
ALTER TABLE `imagenes_restaurante`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_restaurante` (`id_restaurante`);

--
-- Indices de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD PRIMARY KEY (`id_reservacion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_restaurante` (`id_restaurante`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id_reseña`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_restaurante` (`id_restaurante`);

--
-- Indices de la tabla `restaurantes`
--
ALTER TABLE `restaurantes`
  ADD PRIMARY KEY (`id_restaurante`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `horarios_restaurante`
--
ALTER TABLE `horarios_restaurante`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `imagenes_restaurante`
--
ALTER TABLE `imagenes_restaurante`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  MODIFY `id_reservacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `restaurantes`
--
ALTER TABLE `restaurantes`
  MODIFY `id_restaurante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`);

--
-- Filtros para la tabla `horarios_restaurante`
--
ALTER TABLE `horarios_restaurante`
  ADD CONSTRAINT `horarios_restaurante_ibfk_1` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`);

--
-- Filtros para la tabla `imagenes_restaurante`
--
ALTER TABLE `imagenes_restaurante`
  ADD CONSTRAINT `imagenes_restaurante_ibfk_1` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`);

--
-- Filtros para la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `reservaciones_ibfk_2` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`);

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `reseñas_ibfk_2` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
