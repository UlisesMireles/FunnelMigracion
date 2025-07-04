USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[spOportunidades_ObtenerOportunidadesPorEstatus]    Script Date: 28/05/2025 10:57:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles cruz
-- Create date: 2025-03-06
-- Description:	Obtener oportunidades por IdEstatus y por IdUsuario
-- Create date: 2025-05-28
-- Description:	Se agregaron campos de prospectos
-- =============================================
ALTER PROCEDURE [dbo].[spOportunidades_ObtenerOportunidadesPorEstatus]
	@pIdUsuario INT = 0,
	@pIdEstatusOportunidad INT = 0,
    @pIdEmpresa int = 0
WITH RECOMPILE
AS
BEGIN

	DECLARE	@vIdUsuario INT = @pIdUsuario,
		@vIdEstatusOportunidad INT = @pIdEstatusOportunidad,
		@vIdEmpresa INT = @pIdEmpresa

	DECLARE @vTipoUsuario VARCHAR(100)
	SET @vTipoUsuario = (
		SELECT tu.Descripcion 
		FROM TiposUsuarios tu 
		JOIN Usuarios u ON tu.IdTipoUsuario = u.IdTipoUsuario
		WHERE u.IdUsuario = @vIdUsuario
	)

	IF @vTipoUsuario != 'Agente'
	BEGIN
		SET @vIdUsuario = 0;
	END
	;WITH DiasEtapas AS (
	SELECT o.IdOportunidad,
	 ISNULL(DATEDIFF(
			DAY, 
			(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 2), 
			ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad
			AND IdStage != 2 AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 2)
			), GETDATE())
		), 0) AS DiasEtapa1,
		ISNULL(DATEDIFF(
			DAY, 
			(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 3), 
			ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad
			AND IdStage != 3 AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 3)
			), GETDATE())
		), 0) AS DiasEtapa2,
		ISNULL(DATEDIFF(
			DAY, 
			(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 4), 
			ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad
			AND IdStage != 4 AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 4)
			), GETDATE())
		), 0) AS DiasEtapa3,
		ISNULL(DATEDIFF(
			DAY, 
			(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 5), 
			ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad
			AND IdStage != 5 AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 5)
			), GETDATE())
		), 0) AS DiasEtapa4,
		ISNULL(DATEDIFF(
			DAY, 
			(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 6), 
			ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad
			AND IdStage != 6 AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = O.IdOportunidad AND IdStage = 6)
			), GETDATE())
		), 0) AS DiasEtapa5
		FROM Oportunidades o
		WHERE (@vIdUsuario = 0 OR o.IdEjecutivo = @vIdUsuario)  
		--and eo.Descripcion != 'Eliminada'  --se comentariza para que tambien acepte eliminadas ahora que es eliminacion logica
		AND (@vIdEstatusOportunidad = 0 OR o.IdEstatusOportunidad = @vIdEstatusOportunidad)
		AND o.IdEmpresa = @vIdEmpresa 
	)

	SELECT DISTINCT o.IdOportunidad,  s.NombreSector, P.IdProspecto, P.UbicacionFisica, P.Estatus,
		CONVERT(VARCHAR(10), O.IdOportunidad) AS Ident, p.Nombre, o.NombreOportunidad, 
		o.ArchivoDescripcion,
		CASE WHEN DATALENGTH(o.NombreOportunidad) > 80 THEN SUBSTRING(o.NombreOportunidad, 0, 80) + '...'  ELSE o.NombreOportunidad END AS NombreAbreviado, 
		tp.Abreviatura ,tp.Descripcion,
		te.Abreviatura AS Entrega, te.Descripcion AS EntregaDescripcion,
		ISNULL(u.Iniciales, 'S/A') AS Iniciales,
		c.Nombre AS NombreContacto,
		CASE WHEN u.Iniciales IS NULL THEN 'Sin Asignar' ELSE u.Nombre + ' ' + u.ApellidoPaterno + ' ' + u.ApellidoMaterno END AS NombreEjecutivo,
		o.monto,(CASE WHEN o.Probabilidad = 0 THEN '0 %' ELSE CONVERT(VARCHAR, FORMAT(o.Probabilidad, '#')+' %') END) AS Probabilidad, 
		DATEDIFF(DAY,o.FechaModificacion, GETDATE()) AS FechaModificacion, ho.Comentario, (o.monto * (o.probabilidad /  100.0)) AS MontoNormalizado, 
		FORMAT(o.FechaRegistro, 'dd/MM/yyyy') AS FechaRegistro, 
		o.FechaRegistro AS FechaRegistroDate,
		eo.Abreviatura AS AbreviaturaEstatus, eo.Descripcion AS DescripcionEstatus,
		o.Probabilidad AS decProbabilidad, o.IdEjecutivo, 
		FORMAT(CASE WHEN @vIdEstatusOportunidad in(2,3,4,5) THEN bo2.FechaRegistro WHEN @vIdEstatusOportunidad=1 THEN o.FechaEstimadaCierre END, 'yyyy-MM-dd') AS FechaEstimadaCierreUpd, 
		CASE WHEN @vIdEstatusOportunidad in(2,3,4,5) THEN bo2.FechaRegistro WHEN @vIdEstatusOportunidad=1 THEN o.FechaEstimadaCierre END AS FechaEstimadaCierre,
		O.FechaEstimadaCierre AS FechaEstimadaCierreOriginal,
		(CASE WHEN bo.Probabilidad = 0 THEN '0 %' ELSE CONVERT(VARCHAR, FORMAT(bo.Probabilidad, '#')+' %') END) AS ProbabilidadOriginal, 
		DATEDIFF(DAY, o.FechaRegistro, GETDATE()) AS DiasFunnel,
		DATEDIFF(DAY, o.FechaRegistro, ho.FechaRegistro) AS DiasFunnelOriginal,
		o.IdEstatusOportunidad, o.IdStage, st.Stage,  CONCAT(St.Stage, ' - ', St.Concepto) as TooltipStage,
		(select count(*) FROM HistoricoOportunidades  WHERE IdOportunidad = o.IdOportunidad) as TotalComentarios,
		(select count(*) FROM Archivos  WHERE IdOportunidad = o.IdOportunidad AND eliminado = 0) as TotalArchivos,
		o.IdTipoProyecto,
		o.IdTipoEntrega,
		DE.DiasEtapa1,
		DE.DiasEtapa2,
		DE.DiasEtapa3,
		DE.DiasEtapa4, 
		DE.DiasEtapa5,
		o.IdContactoProspecto,
		(SELECT SUBSTRING(CONCAT(c.Nombre, ' ', c.Apellidos), 1, CHARINDEX(' ', CONCAT(c.Nombre, ' ', c.Apellidos) + ' ') - 1)) AS PrimerNombreContacto,
		CONCAT(c.Nombre, ' ', c.Apellidos) as NombreContactoCompleto,
		DATEDIFF(DAY,o.FechaModificacion, GETDATE()) AS DiasSinActividad,
		CASE WHEN u.ArchivoImagen IS NULL THEN 'persona_icono_principal.png' ELSE u.ArchivoImagen END as Foto
	FROM Oportunidades o
		INNER JOIN DiasEtapas DE ON DE.IdOportunidad = o.IdOportunidad
		JOIN Prospectos p ON o.IdProspecto = p.IdProspecto
		LEFT JOIN ContactosProspectos c ON c.IdContactoProspecto = o.IdContactoProspecto
		LEFT JOIN TiposOportunidad tp ON o.IdTipoProyecto = tp.IdTipoProyecto
		LEFT JOIN TiposEntrega te ON o.IdTipoEntrega = te.IdTipoEntrega
		LEFT JOIN HistoricoOportunidades ho ON ho.IdHistoricoOportunidad = 
		(SELECT MAX(IdHistoricoOportunidad) FROM HistoricoOportunidades WHERE IdOportunidad = o.IdOportunidad)
		LEFT JOIN Archivos a ON a.IdOportunidad = (SELECT MAX(IdArchivo) FROM Archivos WHERE IdOportunidad = o.IdOportunidad)
		LEFT JOIN Usuarios u ON o.IdEjecutivo = u.IdUsuario
		LEFT JOIN StageOportunidad st ON o.IdStage = st.Id
		JOIN EstatusOportunidad eo ON o.IdEstatusOportunidad = eo.IdEstatus
		LEFT JOIN Sectores s ON p.IdSector = s.IdSector--se añade para la columna sector
		LEFT JOIN BitacoraOportunidades bo ON bo.IdBitacoraOportunidad = 
		(SELECT MIN(IdBitacoraOportunidad) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad)
		left join (
			SELECT IdOportunidad, max(FechaRegistro) as FechaRegistro
			FROM BitacoraOportunidades 
			where IdEstatusOportunidad = @vIdEstatusOportunidad
			group by IdOportunidad) as bo2
			on bo2.IdOportunidad = o.IdOportunidad 
		WHERE (@vIdUsuario = 0 OR o.IdEjecutivo = @vIdUsuario)  
		--and eo.Descripcion != 'Eliminada'  --se comentariza para que tambien acepte eliminadas ahora que es eliminacion logica
		AND (@vIdEstatusOportunidad = 0 OR o.IdEstatusOportunidad = @vIdEstatusOportunidad)
		AND o.IdEmpresa = @vIdEmpresa 
END


