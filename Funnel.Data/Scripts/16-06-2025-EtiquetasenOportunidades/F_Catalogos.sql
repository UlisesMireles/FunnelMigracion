USE [SFS-QA-TENANT]
GO
/****** Object:  StoredProcedure [dbo].[F_Catalogos]    Script Date: 16/06/2025 11:33:43 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Consulta de catÃ¡logos
-- Author:		Yulissa González
-- Create date: 2025-06-11
-- Description:	Modificación en bandera "Ejecutivo"
-- =============================================
ALTER PROCEDURE [dbo].[F_Catalogos] 
	@pBandera VARCHAR (30) = NULL,
    @pIdEmpresa int = 0,	
    @pEstatus int = 0
AS
BEGIN
	IF @pBandera = 'PROSPECTOS'
	BEGIN
		SELECT 
			IdProspecto, Nombre, FechaRegistro
	   FROM Prospectos P WHERE Estatus = 1 AND IdEmpresa = @pIdEmpresa order by Nombre
	END

	IF @pBandera = 'TIPOOPORTUNIDADES'
	BEGIN
		SELECT IdTipoProyecto, Descripcion FROM TiposOportunidad WHERE Estatus = 1 AND IdEmpresa = @pIdEmpresa
	END
	
	IF @pBandera = 'TIPOENTREGAS'
	BEGIN
		/*SELECT IdTipoEntrega, Descripcion FROM TiposEntrega WHERE Estatus = 1 
AND IdEmpresa = @pIdEmpresa*/
	   SELECT 
				COALESCE(IdTipoEntrega, 1) AS IdTipoEntrega, 
				COALESCE(Descripcion, '') AS Descripcion 
		FROM 
				(SELECT IdTipoEntrega, Descripcion 
				 FROM TiposEntrega 
				 WHERE Estatus = 1 AND IdEmpresa = @pIdEmpresa) AS Subconsulta
		
	END

	IF @pBandera = 'EJECUTIVOS'
	BEGIN
		SELECT 
			IdUsuario, 
			Nombre + ' ' + ApellidoPaterno + ' ' + ISNULL(ApellidoMaterno, '') AS NombreCompleto
		FROM Usuarios u
		WHERE u.IdEmpresa = @pIdEmpresa 
		  AND Estatus = 1 
		  AND IdTipoUsuario IN (1,2,3)
	END

	IF @pBandera = 'ESTATUSOPORTUNIDAD'
	BEGIN
		SELECT IdEstatus, Descripcion FROM EstatusOportunidad
	END

	IF @pBandera = 'SEL-INICIALES'
	BEGIN
		SELECT Iniciales FROM Usuarios WHERE IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'PROSPECTOS-TIPO'
	BEGIN

		SELECT DISTINCT p.IdProspecto as IdProspecto, p.Nombre  as Nombre
		FROM Prospectos p WITH (NOLOCK)
		LEFT JOIN Oportunidades o ON o.IdProspecto = p.IdProspecto
		LEFT JOIN TiposOportunidad tp ON o.IdTipoProyecto = tp.IdTipoProyecto
		WHERE tp.Descripcion IS NOT NULL AND p.IdEmpresa = @pIdEmpresa
		Order By p.Nombre

	END

	IF @pBandera = 'STAGE'
	BEGIN
		SELECT Id, Stage, CONCAT(Stage, ' - ', Concepto) as Concepto 
		FROM StageOportunidad 
		WHERE Stage NOT IN (7,8) 
		ORDER BY Stage
	END

	IF @pBandera = 'STAGEFiltros'
	BEGIN
		SELECT Id, Stage, CONCAT(Stage, ' - ', Concepto) as Concepto 
		FROM StageOportunidad 
		WHERE Stage NOT IN (7,8) 
		AND Estatus = 1
		AND Concepto!='Ganada'
		ORDER BY Stage
	END

	IF @pBandera = 'INDICADORES-STAGE'
	BEGIN
		SELECT Id, Stage, Concepto, Descripcion, ColorSerie, PorcentajeAsignado as Probabilidad
		FROM StageOportunidad 
		WHERE Stage NOT IN (6,7,8) 
		AND Estatus=1
		ORDER BY Stage
	END

	IF @pBandera = 'SEL-VERSION'
	BEGIN
		SELECT top 1 Version FROM Versiones ORDER BY Id desc
	END

	IF @pBandera = 'SEL-PRIMER-AGENTE'
	BEGIN
		SELECT IdUsuario, Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto
		FROM Usuarios u
		WHERE IdTipoUsuario != 1 and IdEmpresa = @pIdEmpresa order by IdUsuario
	END

	
	IF @pBandera = 'ETIQUETAS_OPORTUNIDADES'
	BEGIN
		
		DECLARE @PropectosNuevos INT =
			(SELECT COUNT(DISTINCT o.IdProspecto) AS ProspectosNuevos
			FROM Oportunidades o
			WHERE 
				IdEstatusOportunidad = 1
				AND IdEmpresa = @pIdEmpresa
				AND MONTH(o.FechaRegistro) = MONTH(GETDATE())
				AND YEAR(o.FechaRegistro) = YEAR(GETDATE())
				AND NOT EXISTS (
					SELECT 1
					FROM Oportunidades o2
					WHERE o2.IdProspecto = o.IdProspecto
					  AND o2.FechaRegistro < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
				)
			);

		DECLARE @AbiertasMes INT =
			(SELECT COUNT(IdOportunidad) 
			FROM Oportunidades o
			WHERE 
				IdEstatusOportunidad = 1
				AND IdEmpresa = @pIdEmpresa
				AND MONTH(o.FechaRegistro) = MONTH(GETDATE())
				AND YEAR(o.FechaRegistro) = YEAR(GETDATE())
			);

		DECLARE @GanadasMes INT =
			(SELECT COUNT(DISTINCT bo.IdOportunidad) 
			FROM BitacoraOportunidades bo
			INNER JOIN Oportunidades o ON bo.IdOportunidad = o.IdOportunidad
			WHERE 
				bo.IdEstatusOportunidad = 2
				AND o.IdEstatusOportunidad = 2
				AND o.IdEmpresa = @pIdEmpresa
				AND MONTH(bo.FechaRegistro) = MONTH(GETDATE())
				AND YEAR(bo.FechaRegistro) = YEAR(GETDATE())
			);

		DECLARE @PerdidasMes INT =
			(SELECT COUNT(DISTINCT bo.IdOportunidad) 
			FROM BitacoraOportunidades bo
			INNER JOIN Oportunidades o ON bo.IdOportunidad = o.IdOportunidad
			WHERE 
				bo.IdEstatusOportunidad = 3
				AND o.IdEstatusOportunidad = 3
				AND o.IdEmpresa = @pIdEmpresa
				AND MONTH(bo.FechaRegistro) = MONTH(GETDATE())
				AND YEAR(bo.FechaRegistro) = YEAR(GETDATE())
			);

		select @PropectosNuevos AS ProspectosNuevos, @AbiertasMes AS AbiertasMes, @GanadasMes AS GanadasMes, @PerdidasMes AS PerdidasMes
	END

	
END
