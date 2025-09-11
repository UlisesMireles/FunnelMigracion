-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Xiomara Amador
-- Create date: 08-09-2025
-- Description:	
-- =============================================
ALTER PROCEDURE [dbo].[sp_GestionNuevoRegistroTemporal]
    @Bandera VARCHAR(10), 
    @IdRegistro INT = NULL, 
    @Nombre VARCHAR(100) = NULL,
    @Correo VARCHAR(200) = NULL,
    @Usuario VARCHAR(20) = NULL,
    @RFC VARCHAR(20) = NULL,
    @NombreEmpresa VARCHAR(200) = NULL,
    @Direccion NVARCHAR(50) = NULL,
    @UrlSitio VARCHAR(500) = NULL,
	@TamanoEmpresa VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Bandera = 'INSERTAR'
    BEGIN
        INSERT INTO [dbo].[NuevoRegistroTemporal] (Nombre, Correo)
        VALUES (@Nombre, @Correo);

        SELECT SCOPE_IDENTITY() AS IdRegistroCreado;
    END

    ELSE IF @Bandera = 'ACTUALIZAR'
    BEGIN
        UPDATE [dbo].[NuevoRegistroTemporal]
        SET 
            Nombre        = ISNULL(@Nombre, Nombre),
            Correo        = ISNULL(@Correo, Correo),
            Usuario       = ISNULL(@Usuario, Usuario),
            RFC           = ISNULL(@RFC, RFC),
            NombreEmpresa = ISNULL(@NombreEmpresa, NombreEmpresa),
            Direccion     = ISNULL(@Direccion, Direccion),
            UrlSitio      = ISNULL(@UrlSitio, UrlSitio),
			TamanoEmpresa = ISNULL(@TamanoEmpresa, TamanoEmpresa)
        WHERE IdRegistro = @IdRegistro;

        SELECT @IdRegistro AS IdRegistroActualizado;
    END
END
GO