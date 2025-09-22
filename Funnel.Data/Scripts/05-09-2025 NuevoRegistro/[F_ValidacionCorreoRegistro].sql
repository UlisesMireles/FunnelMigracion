USE [SFS-MASTER-QA]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Xiomara Amador
-- Create date:   05-09-2025
-- Description:   Envía un código temporal de validación al correo proporcionado
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[F_ValidacionCorreoRegistro]
(
    @pCorreo        VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Result         BIT;
    DECLARE @ErrorMessage   VARCHAR(MAX);
    DECLARE @CodigoValidacion INT;
    DECLARE @NumeroDesde    INT = 100000;
    DECLARE @NumeroHasta    INT = 999999;
    DECLARE @Body           VARCHAR(MAX);

    BEGIN TRY
        SET @CodigoValidacion = ROUND(((@NumeroHasta - @NumeroDesde) * RAND() + @NumeroDesde), 0);

        SET @Body = '<html><head><meta charset="UTF-8"></head><body>'
                  + '<p><span style="font-size:18px;"><strong>Hola:</strong></span></p>'
                  + '<p>Para completar tu registro, introduce este código temporal:</p>'
                  + '<p>&nbsp;</p>'
                  + '<p style="text-align:center;"><strong style="font-size:20px;">' 
                  + CONVERT(VARCHAR(6), @CodigoValidacion) + '</strong></p>'
                  + '<p>&nbsp;</p>'
                  + '<p>Este código es válido solo temporalmente.</p>'
                  + '</body></html>';

        EXEC msdb.dbo.sp_send_dbmail
            @profile_name='EmailProfile',
            @recipients = @pCorreo,
            @body = @Body,
            @subject = 'Código de Validación de Registro',
            @body_format = 'HTML';

        SET @Result = 1;
        SET @ErrorMessage = 'Correo enviado correctamente.';

    END TRY
    BEGIN CATCH
        SET @Result = 0;
        SET @ErrorMessage = 'Error al enviar correo: ' + ERROR_MESSAGE();
    END CATCH;

    SELECT @Result AS Result, @ErrorMessage AS ErrorMessage, @CodigoValidacion AS CodigoTemporal;
END
