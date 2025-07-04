USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CodigoValidacionCorreoFunnel]    Script Date: 07/05/2025 10:55:37 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Xiomara Amador
-- Create date: 05-05-2025 
-- Description:	Verifica el código para validar el correo
-- =============================================
CREATE PROCEDURE [dbo].[F_CodigoValidacionCorreoFunnel] 
(	
	@pCorreo		VarChar(200),
	@pCodigo		int
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result			Bit = 0;
	DECLARE @ErrorMessage	Varchar(MAX) = '';
	DECLARE @TipoMensaje	Int = 0;
	DECLARE @TiempoInicio	DATETIME;
	DECLARE @TiempoFin		DATETIME;	

	BEGIN TRAN;

	BEGIN TRY  

		SET @pCorreo = LTRIM(RTRIM(@pCorreo));

		IF EXISTS(SELECT 1 FROM [dbo].[SolicitudesUsuarios] WHERE [Correo] = @pCorreo AND [CodigoAutenticacion] = @pCodigo)
		BEGIN

			SELECT 
				@TiempoInicio = [FechaInicio],
				@TiempoFin = [FechaFin]
			FROM 
				[dbo].[SolicitudesUsuarios] 
			WHERE 
				[Correo] = @pCorreo;

			IF (
				(@TiempoInicio IS NULL AND @TiempoFin IS NULL) OR
				(GETDATE() >= @TiempoInicio AND GETDATE() <= @TiempoFin)
			)
			BEGIN
				SET @Result = 1;				
				SET @ErrorMessage = 'Código Correcto.';
				SET @TipoMensaje = 1;
			END					
			ELSE
			BEGIN
				SET @Result = 0;				
				SET @ErrorMessage = 'Código Caducado.';
				SET @TipoMensaje = 2;
			END

		END
		ELSE
		BEGIN
			SET @ErrorMessage = 'Código incorrecto.';
			SET @Result = 0;	
			SET @TipoMensaje = 3;
		END	
		
		COMMIT TRAN;
	END TRY  
	BEGIN CATCH  
		SET @Result = 0;
		SET @ErrorMessage = 'Error ' + ERROR_MESSAGE();
		ROLLBACK TRAN;
	END CATCH;

	SELECT 
		SU.Nombre,
		SU.Apellidos,
		SU.Correo,
		SU.Telefono,
		SU.Empresa,
		SU.SitioWeb,
		SU.NumEmpleados,
		@Result AS Result,
		@ErrorMessage AS ErrorMessage,
		@TipoMensaje AS TipoMensaje
	FROM [dbo].[SolicitudesUsuarios] SU
	WHERE SU.Correo = @pCorreo AND @Result = 1;

	IF @Result = 0
	BEGIN
		SELECT 
			NULL AS Nombre,
			NULL AS Apellidos,
			@pCorreo AS Correo,
			NULL AS Telefono,
			NULL AS Empresa,
			NULL AS SitioWeb,
			NULL AS NumEmpleados,
			@Result AS Result,
			@ErrorMessage AS ErrorMessage,
			@TipoMensaje AS TipoMensaje
	END
END
