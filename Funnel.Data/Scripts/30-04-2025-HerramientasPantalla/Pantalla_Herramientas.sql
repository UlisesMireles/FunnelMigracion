UPDATE Paginas SET Activo = 0 WHERE Nombre = 'PARÁMETROS';

INSERT INTO dbo.Paginas (IdMenu,Nombre,Activo,FechaCreacion,FechaModificacion,Ruta,Catalogo,RouterLink) VALUES
 (6,N'HERRAMIENTAS',1,'2024-08-02 16:57:25.920',NULL,N'Herramientas.aspx',N'',N'/herramientas');

INSERT INTO dbo.RolesPermisos (IdRol,IdPagina,IdEmpresa,Estatus,FechaRegistro,FechaModificacion) VALUES
(1,17,1,1,'2024-08-02 16:57:39.050','2025-03-26 12:04:03.227');