USE [SFS-MASTER-QA]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Evelin Gutiérrez
-- Create date: 28-07-2025
-- Description:	Preguntas Frecuentes Activas por ID de bot
-- =============================================

CREATE PROCEDURE [dbo].[F_PreguntasFrecuentesActivasPorBot]
	@IdBot Int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		PF.[Id],
		PF.[IdBot],
		A.[NombreAsistente] AS Asistente,
		C.[IdCategoria] AS IdCategoria,
		C.[Descripcion] AS Categoria,
		PF.[Pregunta],
		PF.[Respuesta],
		PF.[FechaCreacion],
		PF.[FechaModificacion],
		PF.[Activo],
		PF.[Estatus]
	FROM 
		[dbo].[PreguntasFrecuentes] PF
	INNER JOIN 
		[dbo].[Asistentes] A ON PF.[IdBot] = A.[IdBot]
	INNER JOIN 
		[dbo].[Categorias] C ON PF.[IdCategoria] = C.[IdCategoria]
	WHERE
		PF.[IdBot] = @IdBot;
END
