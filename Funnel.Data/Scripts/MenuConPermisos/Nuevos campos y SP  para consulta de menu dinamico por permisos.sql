USE [SFS-MASTER-QA]
ALTER TABLE Paginas ADD RouterLink VARCHAR(100) NULL;
GO
ALTER TABLE Menus ADD Icono VARCHAR(100) NULL;
GO
UPDATE Menus SET Icono = 'bi bi-bar-chart' WHERE IdMenu = 1
GO
UPDATE Menus SET Icono = 'bi bi-hourglass-split' WHERE IdMenu = 2
GO
UPDATE Menus SET Icono = 'bi bi-fonts' WHERE IdMenu = 3
GO
UPDATE Menus SET Icono = 'bi bi-briefcase' WHERE IdMenu = 4
GO
UPDATE Menus SET Icono = 'bi-list-ul' WHERE IdMenu = 5
GO
UPDATE Menus SET Icono = 'bi-wrench' WHERE IdMenu = 6
GO


UPDATE Paginas SET RouterLink = '/top-veinte' WHERe IdPagina = 3;
GO
UPDATE Paginas SET RouterLink = '/oportunidades' WHERe IdPagina = 4;
GO
UPDATE Paginas SET RouterLink = '/oportunidades-ganadas' WHERe IdPagina = 5;
GO
UPDATE Paginas SET RouterLink = '/oportunidades-perdidas' WHERe IdPagina = 6;
GO
UPDATE Paginas SET RouterLink = '/oportunidades-canceladas' WHERe IdPagina = 7;
GO
UPDATE Paginas SET RouterLink = '/oportunidades-eliminadas' WHERe IdPagina = 8;
GO
UPDATE Paginas SET RouterLink = '/prospectos' WHERe IdPagina = 9;
GO
UPDATE Paginas SET RouterLink = '/contactos' WHERe IdPagina = 10;
GO
UPDATE Paginas SET RouterLink = '/usuarios' WHERe IdPagina = 11;
GO
UPDATE Paginas SET RouterLink = '/permisos' WHERe IdPagina = 12;
GO
UPDATE Paginas SET RouterLink = '/tipos-servicios' WHERe IdPagina = 13;
GO
UPDATE Paginas SET RouterLink = '/tipos-entrega' WHERe IdPagina = 14;
GO

GO
/****** Object:  StoredProcedure [dbo].[spRolesPermisos_ConsultaPermisosPorRol]    Script Date: 25/03/2025 04:10:28 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Consulta el permiso al menu por rol
-- =============================================
CREATE PROCEDURE [dbo].[spRolesPermisos_ConsultaPermisosPorRol] 
  @pIdEmpresa int = 0,
  @pIdRol int = 0
AS
BEGIN
		
		SELECT 
			RP.IdPagina
			,P.IdMenu
			,M.Icono
			,M.Nombre as Menu
			,P.Nombre as Pagina
			,p.RouterLink AS Ruta
		FROM RolesPermisos RP
		INNER JOIN RelacionRolesEmpresa RRE ON RRE.IdRol = RP.IdRol AND RRE.IdEmpresa = 1 AND RRE.Estatus = 1
		LEFT JOIN Paginas P ON RP.IdPagina = P.IdPagina AND P.Activo = 1
		LEFT JOIN Menus M ON M.IdMenu = P.IdMenu
		WHERE RP.IdEmpresa = @pIdEmpresa AND RP.IdRol = @pIdRol AND RP.Estatus = 1
	

END

