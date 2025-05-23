USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_EjecucionReportes]    Script Date: 22/05/2025 02:04:16 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Registro o actualiza la ejecucion del job de reporte semanal de seguimiento de oportunidades
-- =============================================
ALTER PROCEDURE [dbo].[F_EjecucionReportes] 
  @pBandera VARCHAR(100),
  @pIdEmpresa int = 0,
  @pIdReporte int = 0,
  @pEstatus BIT = 0,
  @pDiasInactividad INT = 0,
  @pDiasFechaVencida INT = 0,
  @pUsuarioRegistro INT = 0,
  @pCorreos VARCHAR(MAX) = NULL
AS
BEGIN
	IF @pBandera = 'INSERT'
	BEGIN
		IF EXISTS (SELECT IdEmpresa FROM EjecucionReportes WHERE IdEmpresa = @pIdEmpresa AND IdReporte = @pIdReporte)
		BEGIN
			UPDATE EjecucionReportes SET 
				EjecucionJob = @pEstatus,
				UsuarioModifico = @pUsuarioRegistro,
				DiasInactividad = @pDiasInactividad,
				DiasFechaVencida = @pDiasFechaVencida,
				FechaModificacion = GETDATE()
			WHERE IdEmpresa = @pIdEmpresa AND IdReporte = @pIdReporte

			DELETE FROM UsuariosReportesAutomaticos
			WHERE IdEmpresa = @pIdEmpresa AND IdReporte = @pIdReporte	

			INSERT INTO UsuariosReportesAutomaticos (IdEmpresa,IdReporte,IdUsuarioEnviar,UsuarioRegistro,FechaRegistro)
			SELECT @pIdEmpresa, @pIdReporte,IdUsuario, @pUsuarioRegistro, GETDATE() FROM Usuarios WHERE CorreoElectronico IN (
				SELECT value FROM STRING_SPLIT(@pCorreos, ',')
			) AND Estatus = 1 AND IdEmpresa = @pIdEmpresa


		END

		ELSE 
		BEGIN
			INSERT INTO EjecucionReportes (IdEmpresa, IdReporte, EjecucionJob, DiasInactividad,DiasFechaVencida, UsuarioRegistro, FechaRegistro) VALUES
			(@pIdEmpresa, @pIdReporte, @pEstatus,@pDiasInactividad, @pDiasFechaVencida, @pUsuarioRegistro, GETDATE())


			DELETE FROM UsuariosReportesAutomaticos
			WHERE IdEmpresa = @pIdEmpresa AND IdReporte = @pIdReporte	

			INSERT INTO UsuariosReportesAutomaticos (IdEmpresa,IdReporte,IdUsuarioEnviar,UsuarioRegistro,FechaRegistro)
			SELECT @pIdEmpresa, @pIdReporte,IdUsuario, @pUsuarioRegistro, GETDATE() FROM Usuarios WHERE CorreoElectronico IN (
				SELECT value FROM STRING_SPLIT(@pCorreos, ',')
			) AND Estatus = 1 AND IdEmpresa = @pIdEmpresa

		END
		
	END
	ELSE IF @pBandera = 'SEL-POREMPRESA'
	BEGIN 
		SELECT DISTINCT
			TR.IdReporte
			,TR.Nombre
			,TR.HoraEjecucion
			,TR.Frecuencia
			,ISNULL(E.DiasInactividad, 0) AS DiasInactividad
			,ISNULL(E.DiasFechaVencida, 0) AS DiasFechaVencida
			,EjecucionJob = ISNULL((SELECT EjecucionJob FROM EjecucionReportes WHERE IdEmpresa = @pIdEmpresa AND IdReporte = TR.IdReporte),0)
		FROM TiposReporteJobs TR
		LEFT JOIN EjecucionReportes E ON E.IdReporte = TR.IdReporte AND IdEmpresa = @pIdEmpresa
	END 

	ELSE IF @pBandera = 'SEL-USUARIOSACTIVOS'
	BEGIN 
		SELECT DISTINCT Nombre, CorreoElectronico
		FROM Usuarios 
		WHERE IdEmpresa = @pIdEmpresa AND Estatus = 1
	END
	
	ELSE IF @pBandera = 'SEL-USUARIOS-REPORTE-AUTO'
	BEGIN 
		SELECT DISTINCT U.Nombre, U.CorreoElectronico
		FROM Usuarios U
		JOIN UsuariosReportesAutomaticos RP ON RP.IdUsuarioEnviar = U.IdUsuario AND RP.IdReporte = @pIdReporte
		WHERE U.IdEmpresa = @pIdEmpresa AND U.Estatus = 1
	END
END