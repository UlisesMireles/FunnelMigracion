USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_EnvioCorreoUsuarioAdministradores]    Script Date: 08/09/2025 13:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Xiomara Amador
-- Create date:   08-09-2025
-- Description:   Envía un correo con los datos de un usuario a todos los administradores de la empresa
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[F_EnvioCorreoRegistrosUsuarioAdministradores]
(
    @pIdUsuario   INT,
    @pIdEmpresa   INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Result       BIT;
    DECLARE @ErrorMessage VARCHAR(MAX);
    DECLARE @Body         VARCHAR(MAX);
    DECLARE @Subject      VARCHAR(200) = 'Información de Usuario Registrado';
    DECLARE @Destinatarios VARCHAR(MAX);

    BEGIN TRY
        DECLARE @Nombre NVARCHAR(200),
                @Usuario NVARCHAR(100),
                @Correo NVARCHAR(150);
        SELECT 
            @Nombre = (ISNULL(Nombre,'') + ' ' + ISNULL(ApellidoPaterno,'') + ' ' + ISNULL(ApellidoMaterno,'')),
            @Usuario = Usuario,
            @Correo = CorreoElectronico
        FROM [dbo].[Usuarios]
        WHERE IdUsuario = @pIdUsuario;

        SELECT @Destinatarios = STRING_AGG(CorreoElectronico, ';')
        FROM [dbo].[Usuarios]
        WHERE IdEmpresa = @pIdEmpresa
          AND IdTipoUsuario = 1
          AND Estatus = 1
          AND CorreoElectronico IS NOT NULL;

        SET @Body = '<html><head><meta charset="UTF-8"></head><body>'
                  + '<h3>Se ha registrado un usuario</h3>'
				  + '<h3>Acciede al sitio para activarlo</h3>'
                  + '<p><b>Nombre:</b> ' + ISNULL(@Nombre,'') + '</p>'
                  + '<p><b>Usuario:</b> ' + ISNULL(@Usuario,'') + '</p>'
                  + '<p><b>Correo:</b> ' + ISNULL(@Correo,'') + '</p>'
                  + '</body></html>';

        EXEC msdb.dbo.sp_send_dbmail
            @profile_name = 'EmailProfile',
            @recipients = @Destinatarios,
            @body = @Body,
            @subject = @Subject,
            @body_format = 'HTML';

        SET @Result = 1;
        SET @ErrorMessage = 'Correo enviado correctamente a los administradores.';

    END TRY
    BEGIN CATCH
        SET @Result = 0;
        SET @ErrorMessage = 'Error al enviar correo: ' + ERROR_MESSAGE();
    END CATCH;

    SELECT @Result AS Result, @ErrorMessage AS ErrorMessage;
END
GO
