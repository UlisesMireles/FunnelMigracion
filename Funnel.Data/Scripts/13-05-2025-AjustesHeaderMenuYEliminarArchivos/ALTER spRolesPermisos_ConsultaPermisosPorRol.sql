USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[spRolesPermisos_ConsultaPermisosPorRol]    Script Date: 13/05/2025 09:59:47 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Consulta el permiso al menu por rol
--Modificacion Daniel mercado 27/03/2025 se agrega orden a la consulta
-- Author:		Lizbeth Morales
-- Update date: 28/04/2025
-- Description: Se agrega al where que el idMenu no traiga elemento null
-- =============================================
ALTER PROCEDURE [dbo].[spRolesPermisos_ConsultaPermisosPorRol] 
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
			,M.ColorIcono
		FROM RolesPermisos RP
		INNER JOIN RelacionRolesEmpresa RRE ON RRE.IdRol = RP.IdRol AND RRE.IdEmpresa = 1 AND RRE.Estatus = 1
		LEFT JOIN Paginas P ON RP.IdPagina = P.IdPagina AND P.Activo = 1
		LEFT JOIN Menus M ON M.IdMenu = P.IdMenu
		WHERE RP.IdEmpresa = @pIdEmpresa AND RP.IdRol = @pIdRol AND RP.Estatus = 1 AND M.IdMenu IS NOT NULL
		ORDER BY M.Orden Asc;
	

END

