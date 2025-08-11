USE [SFS-MASTER-QA]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:  Xiomara
-- Create date: 11/08/2025
-- Description: Retorna información de preguntas y respuestas según bandera
-- =============================================
ALTER PROCEDURE [dbo].[F_EncuestaBot]
    @IdCategoria INT = NULL,
    @pBandera NVARCHAR(50),

    @IdBot INT = NULL,
    @Pregunta VARCHAR(255) = NULL,
    @FechaPregunta DATETIME = NULL,
    @Respuesta VARCHAR(MAX) = NULL,
    @FechaRespuesta DATETIME = NULL,
    @Respondio BIT = NULL,
    @TokensEntrada INT = NULL,
    @TokensSalida INT = NULL,
    @IdUsuario INT = NULL,
    @CostoPregunta DECIMAL(18,8) = NULL,
    @CostoRespuesta DECIMAL(18,8) = NULL,
    @CostoTotal DECIMAL(18,8) = NULL,
    @Modelo VARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @pBandera = 'SELECT-PREGUNTAS'
    BEGIN
        SELECT 
            p.Id AS IdPregunta,
            p.Pregunta,
			p.Respuesta AS TipoRespuesta,
			p.IdBot,
            r.IdRespuesta,
            r.Respuesta,
            p.IdCategoria
        FROM [dbo].[PreguntasFrecuentes] p
        LEFT JOIN [dbo].[RespuestasEncuesta] r
            ON p.Id = r.IdPregunta
        WHERE p.IdCategoria = @IdCategoria AND p.IdBot = @IdBot
        ORDER BY p.Id, r.IdRespuesta;
    END
    ELSE IF @pBandera = 'INSERT-RESPUESTAS'
    BEGIN
        INSERT INTO [dbo].[BitacoraRespuestasEncuesta] 
        (
            IdBot, Pregunta, FechaPregunta, Respuesta, FechaRespuesta,
            Respondio, TokensEntrada, TokensSalida, IdUsuario,
            CostoPregunta, CostoRespuesta, CostoTotal, Modelo
        )
        VALUES
        (
            @IdBot, @Pregunta, @FechaPregunta, @Respuesta, @FechaRespuesta,
            @Respondio, @TokensEntrada, @TokensSalida, @IdUsuario,
            @CostoPregunta, @CostoRespuesta, @CostoTotal, @Modelo
        );
    END
END
GO

USE [SFS-MASTER-QA];
GO

ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [FechaPregunta] datetime NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [TokensEntrada] int NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [TokensSalida] int NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [CostoPregunta] decimal(18,8) NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [CostoRespuesta] decimal(18,8) NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [CostoTotal] decimal(18,8) NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [Modelo] varchar(30) NULL;
ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] ALTER COLUMN [Respondio] bit NULL;
GO

