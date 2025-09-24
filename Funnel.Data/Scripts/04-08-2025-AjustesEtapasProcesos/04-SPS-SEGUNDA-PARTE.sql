/****** Object:  StoredProcedure [dbo].[F_CatalogoProcesos]    Script Date: 04/08/2025 05:21:57 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Mario Canales>
-- Create date: <10-07-2025>
-- Description:	<Administración de las plantillas de procesos>
-- =============================================
ALTER   PROCEDURE [dbo].[F_CatalogoProcesos] 
	@pBandera VARCHAR (50) = NULL,
	@pIdEmpresa int = 0,
	@pIdProceso int = 0,
	@pIdUsuario int = 0,
	@pNombre VARCHAR (100) = NULL,
	@pEstatus bit = 0,
	@pIdStage int = 0,
	@pNombreEtapa VARCHAR(100) = NULL,
	@pOrdenEtapa int = 0,
	@pProbabilidad int = 0,
	@pRProsceosEtapas ProcesosEtapas READONLY
AS
BEGIN
	DECLARE @vIdNuevoProceso INT = 0

	IF @pBandera = 'PLANTILLAS-ETAPAS'
	BEGIN
		SELECT PL.Id IdPlantilla, PL.Plantilla, PL.Estatus, CASE WHEN PL.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END DesEstatus,
			R.IdStage, CAST(E.Stage as varchar) Orden, E.Concepto NombreEtapa, CAST(E.PorcentajeAsignado as varchar) Probabilidad
		FROM StageOportunidad E
		JOIN RelacionPlantillaProcesoStage R ON R.IdStage = E.Id 
		JOIN PlantillasProcesosStage PL ON PL.Id = R.IdPlantilla
		WHERE E.Estatus = 1
	END

	IF @pBandera = 'PROCESOS-POR-EMPRESA'
	BEGIN		
		SELECT P.Id, P.Nombre, P.Estatus, CASE WHEN P.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END DesEstatus,
			P.IdEmpresa, 0 Oportunidades, 0 OportunidadesGanadas, 0 OportunidadesPerdidas, 0 OportunidadesCanceladas, 0 OportunidadesEliminadas 
		FROM Procesos p
		WHERE IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'PROCESOS-ETAPAS'
	BEGIN
		SELECT R.Id RIdProcesoEtapa, R.IdProceso, P.Nombre NombreProceso, P.Estatus,
		R.IdStage, R.Estatus EstatusEtapaProceso,CAST(R.Orden as varchar) Orden, E.Concepto NombreEtapa, CAST(R.PorcentajeAsignado as varchar) Probabilidad
		FROM RelacionProcesoStage R
		JOIN StageOportunidad E ON E.Id = R.IdStage
		JOIN Procesos P ON P.Id = R.IdProceso
		WHERE R.IdProceso = @pIdProceso AND R.Estatus = 1
		ORDER BY R.Orden
	END

	IF @pBandera = 'INSERTAR-ETAPA'
	BEGIN
		INSERT INTO StageOportunidad (Stage,Concepto,FechaRegistro,Estatus,PorcentajeAsignado) 
		VALUES (@pOrdenEtapa,@pNombreEtapa,GETDATE(),1,@pProbabilidad);	

		SELECT SCOPE_IDENTITY() AS IdStage;
	END

	/*
	IF @pBandera = 'UPDATE-ETAPA'
	BEGIN
		UPDATE StageOportunidad
		SET PorcentajeAsignado = @pProbabilidad
		WHERE Id = @pIdStage

		SELECT @pIdStage AS IdStage
	END
	*/

	IF @pBandera = 'INS-PROCESO-ETAPA'
	BEGIN

		IF(@pIdProceso = 0)
		BEGIN
			INSERT INTO Procesos (Nombre,Estatus,IdEmpresa,FechaRegistro,UsuarioRegistro)
			VALUES(@pNombre,@pEstatus,@pIdEmpresa,GETDATE(),@pIdUsuario)

			SET @vIdNuevoProceso = SCOPE_IDENTITY()
		END
		ELSE
		BEGIN
			UPDATE Procesos
			SET Nombre = @pNombre, Estatus = @pEstatus, IdEmpresa = @pIdEmpresa, FechaModificacion = GETDATE(), UsuarioModificacion = @pIdUsuario
			WHERE Id = @pIdProceso

			SET @vIdNuevoProceso = @pIdProceso
		END
		
		INSERT INTO RelacionProcesoStage (IdProceso,IdStage,Estatus, PorcentajeAsignado, Orden)
		SELECT @vIdNuevoProceso, IdStage, Estatus, PorcentajeAsignado, Orden
		FROM @pRProsceosEtapas R
		WHERE R.RIdProcesoEtapa = 0

		UPDATE PE
		SET
			PE.Estatus = R.Estatus,
			PE.PorcentajeAsignado = R.PorcentajeAsignado,
			PE.Orden = R.Orden
		FROM RelacionProcesoStage PE
		JOIN @pRProsceosEtapas R ON R.RIdProcesoEtapa = PE.Id AND R.RIdProcesoEtapa != 0		

	END
END
