USE [SFS-MASTER-QA]
GO
-- Update date: 17-06-2025
-- Description:	Se agrega el campo de prompt a la tabla

ALTER TABLE [dbo].[Asistentes]
ADD [Prompt] VARCHAR(MAX) NULL;
GO

USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_ConfiguracionAsistentesPorIdBot]    Script Date: 17/06/2025 12:43:30 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Juan Carlos Bernadac Delfin
-- Create date: 04-12-2024
-- Description:	Obtiene la Configuración del Asistente por Asistente (IdBot)
-- Update date: 16-01-2021
-- Description:	Se agrega el campo de creditos a las consultas 
-- Update date: 17-01-2021
-- Description:	Se agrega el campo de RutaDocumento a las consultas 
-- Update date: 17-05-2025
-- Description: Se agrego campo de prompt de asistentes
-- =============================================
ALTER PROCEDURE [dbo].[F_ConfiguracionAsistentesPorIdBot]
	@IdBot	Int
AS
	BEGIN
	
	SET NOCOUNT ON;

		SELECT 
			A.[IdBot]
			,A.[NombreAsistente] AS Asistente
			,A.[NombreTablaAsistente]
		    ,A.[MensajePrincipalAsistente]
			,A.[Prompt]
			,C.[Llave]
			,M.[Modelo]
			,M.[Descripcion]
			,M.[CostoTokensEntrada]
			,M.[CostoTokensSalida]
			,M.[MaximoTokens]
			,C.[Creditos]
			,A.[RutaDocumento]
		FROM 
			[dbo].[ConfiguracionAsistentes] C
		INNER JOIN
			[dbo].[Asistentes] A
		ON
			C.[IdBot] = A.[IdBot]
		INNER JOIN
			[dbo].[ModelosOpenIA] M
		ON
			M.[Modelo] = C.[Modelo]
		WHERE 
			C.[IdBot] = @IdBot
END

