
PRINT('Object:  StoredProcedure [dbo].[F_AutentificacionFunnelDosPasos]    Script Date: 08/04/2025 06:05:59 p. m. ******/')
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 25-02-2025
-- Description:	Autentificacion en Dos Pasos para sistema funnel
-- =============================================
ALTER PROCEDURE [dbo].[F_AutentificacionFunnelDosPasos] 	
(
	@pUsuario		VarChar(20),
	@pPassword		VarChar(200)
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Exists					Bit;
	DECLARE @Respuesta				INT;
	DECLARE @Result					Bit;
	DECLARE @ErrorMessage			Varchar(MAX);	
	DECLARE @IdUsuario				INT;
	DECLARE @Nombre					Varchar(200);
	DECLARE @Correo					Varchar(100);
	DECLARE @IdEmpresa				INT;		
	DECLARE @IdTipoUsuario			INT;	
	DECLARE @Alias					Varchar(20);
	DECLARE @TipoUsuario			Varchar(100);
	BEGIN TRAN;

	BEGIN TRY  		
		DECLARE @Activo					Bit;
		DECLARE @CodigoAutentificacion	Int;		
		DECLARE	@TiempoInicio			DateTime;
		DECLARE	@TiempoFin				DateTime;
		DECLARE @NumeroDesde			Int = 100000;
		DECLARE @NumeroHasta			Int = 999999;		

		IF EXISTS(	
			SELECT LE.[Usuario] FROM [dbo].[Usuarios] LE 
				INNER JOIN [Empresas] E ON LE.IdEmpresa = E.IdEmpresa 
			WHERE [Usuario] = @pUsuario AND [Password] = @pPassword AND Estatus = 1 AND E.Activo = 1
			)
			BEGIN
				SELECT 
					@Correo = [CorreoElectronico]
					,@TiempoInicio = [FechaInicio]
					,@TiempoFin = [FechaFin]
					,@Nombre = [Nombre]
					,@CodigoAutentificacion = [CodigoAutenticacion]
					,@IdUsuario = [IdUsuario]
					,@IdTipoUsuario = U.IdTipoUsuario
					,@TipoUsuario = TU.Descripcion
					,@IdEmpresa = U.IdEmpresa
					,@Alias = E.Alias
				FROM 
					[dbo].[Usuarios] U
				LEFT JOIN Empresas E ON U.IdEmpresa = E.IdEmpresa
				JOIN TiposUsuarios TU ON U.IdTipoUsuario = TU.IdTipoUsuario 
				WHERE 
					[Usuario] = @pUsuario AND [Password] = @pPassword;
				
				SET @Activo = (SELECT
					CASE 
						WHEN @TiempoInicio IS NULL AND @TiempoFin IS NULL THEN 1
						WHEN GETDATE() >= @TiempoInicio AND GETDATE() >= @TiempoFin  THEN 1					  
						ELSE 0
					END);

				IF(@Activo = 1)
					BEGIN
						
						SET @CodigoAutentificacion = ROUND(((@NumeroHasta - @NumeroDesde) * RAND() + @NumeroDesde), 0);

						UPDATE [dbo].[Usuarios]
						SET 
							[CodigoAutenticacion] = @CodigoAutentificacion
							,[FechaInicio] = GETDATE()
							,[FechaFin] = DATEADD(MINUTE, 2, GETDATE())
						WHERE 
							[Usuario] = @pUsuario AND [Password] = @pPassword;	
					END					
				
				DECLARE @Body VARCHAR(MAX) = '<html><head><meta charset="UTF-8"></head><body>';
				SET @Body = @Body + '<p><span style="font-size:18px;"><strong>Hola, '
									+ @Nombre + ':&nbsp;</strong></span></p>'
									+ '<p>Para acceder al sistema Funnel, introduce este código:</p>'
									+ '<p>&nbsp;</p>'
									+ '<p style="text-align:center;"><strong style="font-size:20px;">' + CONVERT(varchar(6), @CodigoAutentificacion) + '</strong></p>'
									+ '<p>&nbsp;</p>'
									+ '<p>Este paso adicional se desencadena cuando detectemos un intento de inicio de sesión inusual.</p>'
									+ '</body></html>';


				--EXEC msdb.dbo.sp_send_dbmail
				--	@profile_name='EmailProfile',
				--	@recipients = @Correo,
				--	@body=@Body,
				--	@subject='Código Autentificación Funnel',
				--	@body_format = 'HTML';

				SET @Exists = 1;	
				SET @Respuesta = 0;			
				SET @ErrorMessage = 'Usuario Correcto.';

			END
		ELSE IF EXISTS(SELECT LE.IdUsuario FROM Usuarios LE INNER JOIN Empresas E ON LE.IdEmpresa = E.IdEmpresa  
					WHERE Usuario = @pUsuario AND Password = @pPassword and LE.Estatus=0 AND E.Activo = 1) 
			BEGIN
				SET @Exists = 0;	
				SET @Respuesta = 1;
				SET @ErrorMessage = 'Usuario está dado de baja.'; --usuario desactivado
			END
		ELSE IF EXISTS(SELECT LE.IdUsuario FROM Usuarios LE INNER JOIN Empresas E ON LE.IdEmpresa = E.IdEmpresa  
						WHERE Usuario = @pUsuario AND Password = @pPassword AND E.Activo = 0) 
			BEGIN
				SET @Exists = 0;
				SET @Respuesta = 2;				
				SET @ErrorMessage = 'Usuario desactivado'; --usuario desactivado
			END
		ELSE
			BEGIN
				SET @Exists = 0;
				SET @Respuesta = -1;				
				SET @ErrorMessage = 'Usuario o contraseña incorrectos.';

			END

		SET @Result = 1;	
		
		COMMIT TRAN;
	END TRY  
	BEGIN CATCH  
		SET @Result = 0;
		SET @ErrorMessage = 'Error ' + ERROR_MESSAGE();
		ROLLBACK TRAN;
	END CATCH;

	SELECT @Exists AS Existe, @Result AS Result, @ErrorMessage AS Error, @IdUsuario AS IdUsuario, @Nombre as Nombre, @Correo AS Correo, 
	@IdTipoUsuario AS IdTipoUsuario, @IdEmpresa AS IdEmpresa, @Alias AS Alias, @Respuesta AS Respuesta, @TipoUsuario As TipoUsuario;
END

