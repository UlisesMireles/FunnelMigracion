USE [SFS-MASTER-QA]
CREATE TABLE VersionesArquitecturaGlupoint(
	Id INT IDENTITY(1,1) NOT NULL,
	VersionNet VARCHAR(20) NOT NULL,
	VersionAngular VARCHAR(20) NOT NULL,
	VersionAplicacion VARCHAR(20) NOT NULL,
	FechaREgistro DATETIME NOT NULL,
	Activo BIT NOT NULL
);
GO
INSERT INTO VersionesArquitecturaGlupoint(VersionNet, VersionAngular, VersionAplicacion, FechaREgistro, Activo) VALUES
('9', '19', '1', GETDATE(), 0),('9', '19', '2', GETDATE(), 1);
GO

GO
/****** Object:  StoredProcedure [dbo].[spObtenerVersion]    Script Date: 27/05/2025 03:11:54 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luis Rey Ibarra Rodriguez
-- Create date: 10/01/2012
-- Description:	Consulta la version actual del sistema
-- =============================================
ALTER PROCEDURE [dbo].[spObtenerVersion]	

AS
BEGIN	
	SET NOCOUNT ON;
	
	SELECT
		CONCAT(VersionNet, '.', VersionAngular , '.', VersionAplicacion) AS Version
	FROM
		[dbo].[VersionesArquitecturaGlupoint] 
	WHERE
			Activo = 1;
END

GO
/****** Object:  StoredProcedure [dbo].[spVersionArquitecturaGlupoint_InsertarNuevaVersionAplicacion]    Script Date: 27/05/2025 03:51:08 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Inserta nueva version de aplicacion
-- =============================================
CREATE PROCEDURE [dbo].[spVersionArquitecturaGlupoint_InsertarNuevaVersionAplicacion] 

AS
BEGIN
	DECLARE @Error VARCHAR(MAX), @OK BIT;

	BEGIN TRY
		BEGIN TRAN	
			DECLARE @UltimaVersionNet VARCHAR(20) = (SELECT TOP 1 VersionNet FROM [VersionesArquitecturaGlupoint] ORDER BY FechaRegistro DESC)
			DECLARE @UltimaVersionAngular VARCHAR(20) = (SELECT TOP 1 VersionAngular FROM [VersionesArquitecturaGlupoint] ORDER BY FechaRegistro DESC)
			DECLARE @UltimaVersionAplicaion VARCHAR(20) = (SELECT TOP 1 VersionAplicacion FROM [VersionesArquitecturaGlupoint] ORDER BY FechaRegistro DESC);
			DECLARE @NuevaVersion VARCHAR(20) =  CAST(CAST(@UltimaVersionAplicaion AS INT) + 1 AS VARCHAR(50));


			UPDATE VersionesArquitecturaChatBots SET Activo = 0 WHERE Activo = 1;
	
			INSERT INTO VersionesArquitecturaChatBots(VersionNet, VersionAngular, VersionAplicacion, FechaRegistro, Activo) VALUES
			(@UltimaVersionNet, @UltimaVersionAngular, ISNULL(@NuevaVersion, '1'), GETDATE(), 1);

			SET @OK = 1;
			SET @Error = '';

		COMMIT;
	END TRY
	BEGIN CATCH
		SET @OK = 0;
		SET @Error = 'Error ' + ERROR_MESSAGE();
		ROLLBACK TRAN;
	END CATCH

	SELECT @OK as OK, @Error as Error
END