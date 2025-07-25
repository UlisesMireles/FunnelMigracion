USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_IngresosFunnel]    Script Date: 30/06/2025 10:29:31 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[F_IngresosFunnel]
	@pBandera VARCHAR (30) = NULL,
	@pIdUsuario INT = NULL,
	@pIdEmpresa INT = NULL,
	@pSesionId VARCHAR(500) = NULL,
	@pMotivoCierre VARCHAR(1000) = NULL
	
AS
BEGIN

	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO IngresosFunnel (IdUsuario, FechaIngreso, IdEmpresa, SesionId) 
		VALUES (@pIdUsuario, GETDATE(), @pIdEmpresa, @pSesionId);
	END
	
	IF @pBandera = 'SELECT'
	BEGIN
		SELECT DISTINCT
			U.IdUsuario, 
			CONCAT(U.Nombre, ' ', U.ApellidoPaterno, ' ', U.ApellidoMaterno) AS Usuario,  
			FechaIngreso
			--(SELECT COUNT(IdUsuario) FROM IngresosFunnel WHERE IdUsuario = I.IdUsuario) as Conteo 
		FROM 
			IngresosFunnel I 
		INNER JOIN Usuarios U ON U.IdUsuario = I.IdUsuario
		WHERE I.IdEmpresa = @pIdEmpresa
		ORDER BY FechaIngreso DESC;
	END

	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE IngresosFunnel 
		SET 
			FechaCierreSesion = GETDATE(),
			MotivoCierre = @pMotivoCierre
		WHERE SesionId = @pSesionId;
	END
END