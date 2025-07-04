USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CatalogoSuperAdmin]    Script Date: 21/04/2025 06:35:18 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Lizbeth Morales
-- Create date: 21/04/2025
-- Description:	Consulta de la informacion del super administrador
-- =============================================
CREATE PROCEDURE [dbo].[F_CatalogoSuperAdmin]
	@pBandera VARCHAR (30) = NULL
AS
BEGIN
	IF @pBandera = 'CONSULTA-ADMINISTRADOR'
	BEGIN
		SELECT TOP 1 * FROM AdministradorEmpresas WHERE SuperAdministrador = 1
	END
END