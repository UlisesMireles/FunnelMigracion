USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_EliminaArchivos]    Script Date: 13/05/2025 11:28:46 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Xiomara Amador
-- Create date: 09-05-2025
-- Description:	Eliminacion de archivos despues de 30 dias
-- =============================================
ALTER PROCEDURE [dbo].[F_EliminaArchivos]
	@pIdOportunidad INT = NULL
AS
BEGIN
	BEGIN

	DECLARE @FechaCierre DATE;
	DECLARE @FechaActual DATE;
	DECLARE @FechaLimite DATE;

		SELECT @FechaCierre = MAX(FechaRegistro)
        FROM BitacoraOportunidades
        WHERE IdOportunidad = @pIdOportunidad AND IdEstatusOportunidad IN (2,3,4,5);

		IF @FechaCierre IS NOT NULL
		BEGIN

			SET @FechaActual = GETDATE(); 
            SET @FechaLimite = DATEADD(DAY, 30, @FechaCierre);

			IF @FechaActual >= @FechaLimite
            BEGIN
                DELETE A
                FROM Archivos A
                WHERE A.IdOportunidad = @pIdOportunidad;
            END
		END
	END
END