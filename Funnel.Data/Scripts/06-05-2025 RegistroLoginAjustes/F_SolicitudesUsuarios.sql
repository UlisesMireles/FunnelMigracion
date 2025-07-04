USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_SolicitudesUsuarios]    Script Date: 07/05/2025 10:56:12 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Registro de usuarios que solicitan el registro 
-- Update Date: 05-05-2025
-- Author: Xiomara Amador
-- Description: Se agrego la validacion de correo, ajuste para correos y telefonos ya existentes
--               bandera para reenvio de codigo
-- =============================================
ALTER PROCEDURE [dbo].[F_SolicitudesUsuarios] 
	@pNombre VARCHAR(100) = NULL,
	@pApellidos VARCHAR(200) = NULL,
	@pCorreo VARCHAR(500) = NULL,
	@pEmpresa VARCHAR(200) = NULL,
	@pTelefono VARCHAR(30) = NULL,
    @pSitioWeb VARCHAR(200) = NULL,
	@pNumEmpleados VARCHAR(50) = NULL,
	@pBandera VARCHAR(20)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result				BIT = 0;
	DECLARE @ErrorMessage		VARCHAR(MAX) = '';
	DECLARE @CodigoAutentificacion INT;
	DECLARE @FechaInicio		DATETIME;
	DECLARE @FechaFin			DATETIME;
	DECLARE @IdUsuario INT;

	BEGIN TRY
		BEGIN TRAN;

		IF @pBandera = 'INSERTAR'
		BEGIN
			IF EXISTS (SELECT 1 FROM SolicitudesUsuarios WHERE Correo = @pCorreo)
			BEGIN
				SET @ErrorMessage = 'El correo electrónico ya ha sido registrado.';
				ROLLBACK TRAN;
				SELECT 0 AS Result, @ErrorMessage AS Error;
				RETURN;
			END

			IF EXISTS (SELECT 1 FROM SolicitudesUsuarios WHERE Telefono = @pTelefono)
			BEGIN
				SET @ErrorMessage = 'El número de teléfono ya ha sido registrado.';
				ROLLBACK TRAN;
				SELECT 0 AS Result, @ErrorMessage AS Error;
				RETURN;
			END

			INSERT INTO 
				SolicitudesUsuarios (Nombre, Apellidos, Correo, Empresa, FechaRegistro, Telefono, SitioWeb, NumEmpleados) 
			VALUES
				(@pNombre, @pApellidos, @pCorreo, @pEmpresa, GETDATE(), @pTelefono, @pSitioWeb, @pNumEmpleados);

			SET @IdUsuario = SCOPE_IDENTITY();
			SET @ErrorMessage = 'Registro exitoso. Código enviado al correo.';
		END
		ELSE IF @pBandera = 'REENVIAR-CODIGO'
		BEGIN
			SELECT TOP 1 @IdUsuario = Id,
						 @pNombre = Nombre
			FROM SolicitudesUsuarios 
			WHERE Correo = @pCorreo 
			ORDER BY FechaRegistro DESC;

			IF @IdUsuario IS NULL
			BEGIN
				SET @ErrorMessage = 'No se encontró una solicitud previa para el correo proporcionado.';
				ROLLBACK TRAN;
				SELECT 0 AS Result, @ErrorMessage AS Error;
				RETURN;
			END

			SET @ErrorMessage = 'Código reenviado al correo.';
		END
		ELSE
		BEGIN
			SET @ErrorMessage = 'Tipo de operación no válido.';
			ROLLBACK TRAN;
			SELECT 0 AS Result, @ErrorMessage AS Error;
			RETURN;
		END

		SET @CodigoAutentificacion = ROUND(((999999 - 100000) * RAND() + 100000), 0);
		SET @FechaInicio = GETDATE();
		SET @FechaFin = DATEADD(MINUTE, 2, @FechaInicio);

		UPDATE SolicitudesUsuarios
		SET CodigoAutenticacion = @CodigoAutentificacion,
			FechaInicio = @FechaInicio,
			FechaFin = @FechaFin
		WHERE Id = @IdUsuario;

		DECLARE @Body VARCHAR(MAX) = '<html><head><meta charset="UTF-8"></head><body>';
		SET @Body = @Body + '<p><span style="font-size:18px;"><strong>Hola, '
							+ @pNombre + ':&nbsp;</strong></span></p>'
							+ '<p>Gracias por registrarte. Para verificar tu dirección de correo electrónico, por favor introduce el siguiente código:</p>'
							+ '<p>&nbsp;</p>'
							+ '<p style="text-align:center;"><strong style="font-size:20px;">' + CONVERT(varchar(6), @CodigoAutentificacion) + '</strong></p>'
							+ '<p>&nbsp;</p>'
							+ '<p>Si no solicitaste este código, puedes ignorar este mensaje.</p>'
							+ '<p style="margin-top: 40px;">Saludos,<br>El equipo de soporte de Sales Funnel System</p>'
							+ '</body></html>';

		EXEC msdb.dbo.sp_send_dbmail
		 	@profile_name='EmailProfile',
		 	@recipients = @pCorreo,
		 	@body=@Body,
		 	@subject='Código Autentificación Funnel',
		 	@body_format = 'HTML';

		SET @Result = 1;

		COMMIT TRAN;
	END TRY
	BEGIN CATCH
		ROLLBACK TRAN;
		SET @Result = 0;
		SET @ErrorMessage = ERROR_MESSAGE();
	END CATCH;

	SELECT 
		@Result AS Result,
		@ErrorMessage AS Error;
END
