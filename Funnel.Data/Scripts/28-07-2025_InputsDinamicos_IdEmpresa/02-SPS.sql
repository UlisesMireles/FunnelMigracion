/****** Object:  StoredProcedure [dbo].[F_InputsAdicionales]    Script Date: 30/07/2025 04:53:53 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mario Canales
-- Create date: 27-06-2025
-- Description:	Operaciones relacionados a inputs dinamicos para prospectos y contactos
-- =============================================
ALTER   PROCEDURE [dbo].[F_InputsAdicionales] 
	@pBandera VARCHAR (50) = NULL,
	@pIdEmpresa int = 0,
	@pTipoCatalogoInput varchar(50) = '',	
	@pIdReferencia int = 0,
	@pInputsCatalogo InputsCatalogo READONLY,
	@pInputsCatalogoData InputsCatalogoData READONLY
AS
BEGIN
	DECLARE @vIdCatalogo INT
	IF @pBandera = 'SEL-INPUTS'
	BEGIN
		SELECT IA.Id IdInput, IA.Nombre, IA.Etiqueta, IA.Requerido, TC.Descripcion TipoCampo, ISNULL(TMP1.RCatalogoInputId,0)RCatalogoInputId, ISNULL(TMP1.Activo,1)Activo
		FROM InputsAdicionales IA
		JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId
		LEFT JOIN (
			SELECT RIC.Id RCatalogoInputId, RIC.InputId, RIC.Activo
			FROM InputsAdicionales IA
			JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId
			JOIN R_InputsCatalogo RIC ON RIC.InputId = IA.Id AND RIC.Activo = 0 AND RIC.IdEmpresa = @pIdEmpresa
			JOIN ConfiguracionTablas TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.NombreTabla) = LOWER(@pTipoCatalogoInput)
		) TMP1 ON TMP1.InputId = IA.Id
	END

	IF @pBandera = 'SEL-INPUTS-CATALOGO'
	BEGIN
		SELECT  RIC.Id RCatalogoInputId,@pTipoCatalogoInput TipoCatalogoInput, RIC.Orden,RIC.Activo, 
			IA.Id IdInput, IA.Nombre, IA.Etiqueta, IA.Requerido, TC.Descripcion TipoCampo
		FROM InputsAdicionales IA
		JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId
		JOIN R_InputsCatalogo RIC ON RIC.InputId = IA.Id AND RIC.Activo = 1 AND RIC.IdEmpresa = @pIdEmpresa
		JOIN ConfiguracionTablas TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.NombreTabla) = LOWER(@pTipoCatalogoInput)
		ORDER BY RIC.Orden ASC
	END

	IF @pBandera = 'SEL-INPUTS-CATALOGO-DATA'
	BEGIN
		SELECT IA.Id IdInput, IA.Nombre, IA.Etiqueta,IA.Requerido, TC.Descripcion TipoCampo, RIC.Id RCatalogoInputId, 
			RIC.Orden,RIC.CatalogoId TipoCatalogoInputId, @pTipoCatalogoInput TipoCatalogoInput,
			ISNULL(D.Id, 0) IdInputData, ISNULL(D.Valor,'') Valor, ISNULL(D.ReferenciaId,0) IdReferencia
		FROM InputsAdicionales IA
		JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId
		JOIN R_InputsCatalogo RIC ON RIC.InputId = IA.Id AND RIC.Activo = 1 AND RIC.IdEmpresa = @pIdEmpresa
		JOIN ConfiguracionTablas TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.NombreTabla) = LOWER(@pTipoCatalogoInput)
		LEFT JOIN InputsAdicionalesData D ON D.RCatalogoInputId = RIC.Id AND D.ReferenciaId = @pIdReferencia
		ORDER BY RIC.Orden ASC
	END

	IF @pBandera = 'SEL-COLUMNAS-POR-CATALOGO'
	BEGIN
		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER(@pTipoCatalogoInput))

		SELECT I.Nombre FROM InputsAdicionales I
		JOIN R_InputsCatalogo RI ON RI.InputId = I.Id AND RI.Activo = 1 AND RI.CatalogoId = @vIdCatalogo AND RI.IdEmpresa = @pIdEmpresa
	END

	--IF @pBandera = 'SEL-COLUMNAS-POR-CATALOGO-DATA'
	--BEGIN
	--	DECLARE @cols NVARCHAR(MAX),
 --       @sql NVARCHAR(MAX)

	--	SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER(@pTipoCatalogoInput))

	--	-- Obtener columnas dinámicas desde los inputs adicionales
	--	SELECT @cols = STRING_AGG(QUOTENAME(I.Nombre), ',')
	--	FROM InputsAdicionales I
	--	JOIN R_InputsCatalogo RI ON I.Id = RI.InputId
	--	WHERE RI.CatalogoId = @vIdCatalogo AND RI.Activo = 1

	--END

	IF @pBandera = 'INS-INPUT-ADICIONAL'
	BEGIN

		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER(@pTipoCatalogoInput))
		
		INSERT INTO R_InputsCatalogo (InputId,CatalogoId,Activo,Orden, IdEmpresa)
		SELECT R.InputId, @vIdCatalogo, R.Activo, R.Orden, @pIdEmpresa  
		FROM @pInputsCatalogo R
		WHERE R.RCatalogoInputId = 0

		UPDATE IC
		SET
			IC.Activo = R.Activo,
			IC.Orden = R.Orden
		FROM R_InputsCatalogo IC
		JOIN @pInputsCatalogo R ON R.RCatalogoInputId = IC.Id AND R.RCatalogoInputId != 0

	END

	IF @pBandera = 'INS-INPUT-ADICIONAL-DATA'
	BEGIN

		INSERT INTO InputsAdicionalesData (RCatalogoInputId,Valor,FechaCreacion,ReferenciaId)
		SELECT D.RCatalogoInputId, D.Valor, GETDATE(), D.ReferenciaId
		FROM @pInputsCatalogoData D
		WHERE D.CatalogoInputDataId = 0

		UPDATE ID
		SET
			ID.Valor = D.Valor,
			FechaModificacion = GETDATE()
		FROM InputsAdicionalesData ID
		JOIN @pInputsCatalogoData D ON D.CatalogoInputDataId = ID.Id AND D.CatalogoInputDataId != 0

	END

END



/****** Object:  StoredProcedure [dbo].[F_CatalogoContactosProspectos]    Script Date: 30/07/2025 04:17:02 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Consulta de catálogos
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoContactosProspectos] 
	@pBandera VARCHAR (30) = NULL,
	@Nombre VARCHAR (50) = NULL,
	@Apellidos VARCHAR (50) = NULL,
	@Telefono VARCHAR (50) = NULL,
	@Correo VARCHAR (100) = NULL,
	@IdProspecto INT = 0,
	@IdContactoProspecto INT = 0,
	@Estatus INT = 0,
	@pIdEmpresa int = 0
AS
BEGIN
	
	DECLARE @vIdCatalogo INT,@cols NVARCHAR(MAX),
        @sql NVARCHAR(MAX)

	IF @pBandera = 'SELECT'
	BEGIN
		SELECT IdContactoProspecto, CONCAT(c.Nombre, ' ', c.Apellidos) as NombreCompleto, c.Nombre, Apellidos, Telefono, CorreoElectronico,
		 CASE WHEN c.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus,c.Estatus, p.Nombre as Prospecto, p.IdProspecto
		FROM ContactosProspectos c 
		LEFT JOIN Prospectos p ON c.IdProspecto = p.IdProspecto
		WHERE c.IdEmpresa = @pIdEmpresa
		AND (@IdProspecto = 0 OR c.IdProspecto = @IdProspecto )
		--ORDER BY Prospecto, Nombre, Apellidos
		ORDER BY Nombre;
	END

	IF @pBandera = 'COLUMNAS-ADICIONALES'
	BEGIN
		
		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER('Contactos'))

		SELECT I.Nombre NombreCampo FROM InputsAdicionales I
		JOIN R_InputsCatalogo RI ON RI.InputId = I.Id AND RI.Activo = 1 AND RI.CatalogoId = @vIdCatalogo AND RI.IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'COLUMNAS-ADICIONALES-DATA'
	BEGIN

		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER('Contactos'))

		-- Obtener columnas dinámicas desde los inputs adicionales
		SELECT @cols = STRING_AGG(QUOTENAME(I.Nombre), ',')
		FROM InputsAdicionales I
		JOIN R_InputsCatalogo RI ON I.Id = RI.InputId
		WHERE RI.CatalogoId = @vIdCatalogo AND RI.Activo = 1

		SET @sql = '
		SELECT 
			C.IdContactoProspecto, 
			C.Nombre, 
			' + @cols + '
		FROM ContactosProspectos C
		LEFT JOIN (
			SELECT 
				IAD.ReferenciaId, 
				I.Nombre, 
				IAD.Valor
			FROM InputsAdicionalesData IAD
			JOIN R_InputsCatalogo RI ON RI.Id = IAD.RCatalogoInputId 
				AND RI.CatalogoId = @pIdCatalogo 
				AND RI.Activo = 1
			JOIN InputsAdicionales I ON I.Id = RI.InputId
		) SRC
		PIVOT (
			MAX(Valor) FOR Nombre IN (' + @cols + ')
		) AS PVT ON C.IdContactoProspecto = PVT.ReferenciaId
		WHERE C.IdEmpresa = @pIdEmpresa;
		';

		-- Ejecutar
		EXEC sp_executesql @sql, N'@pIdEmpresa INT, @pIdCatalogo INT', @pIdEmpresa = @pIdEmpresa, @pIdCatalogo = @vIdCatalogo;

	END

	IF @pBandera = 'SEL-REPETIDOS'
	BEGIN
		SELECT Nombre, Estatus
		FROM ContactosProspectos 
		WHERE IdContactoProspecto != @IdContactoProspecto AND IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO ContactosProspectos (Nombre,  Apellidos, Telefono, CorreoElectronico, IdProspecto, Estatus, FechaRegistro, IdEmpresa) VALUES
							 (@Nombre, @Apellidos, @Telefono, @Correo, @IdProspecto, 1, GETDATE(), @pIdEmpresa)
		SELECT SCOPE_IDENTITY() AS IdContactoProspecto;
	END

	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE ContactosProspectos SET Nombre = CASE WHEN @Nombre IS NULL THEN Nombre ELSE @Nombre END, 
							Apellidos = @Apellidos, Telefono = @Telefono, CorreoElectronico = @Correo,
							IdProspecto = @IdProspecto,Estatus = @Estatus
							WHERE IdContactoProspecto = @IdContactoProspecto
	END

END

/****** Object:  StoredProcedure [dbo].[F_CatalogoProspectos]    Script Date: 30/07/2025 02:10:42 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Consulta de catÃ¡logos
-- Update a consulta select para mostrar solo los prospectos que tienen contactos
-- Update date: 2025-04-25
-- Description:	Se añade calculo de porcentaje de efectividad en SELECT
-- Update date: 2025-07-07
-- Description: Se añade calculo de promedio de dias en cada etapa y dias sin actividad en SELECT
-- Update date: 2025-07-09
-- Description: Se añade Id y descricion del nivel de interes
-- Update date: 2025-07-10
-- Description: Se añade bandera para colocar nivel de interes y select para todas las empresas
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoProspectos] 
	@pBandera VARCHAR (30) = NULL,
	@Nombre VARCHAR (50) = NULL,
	@UsbicacionFisica VARCHAR (200) = NULL,
	@IdProspecto INT = 0,
	@Estatus INT = 0,
	@pIdEmpresa int = 0,
	@pIdSector int = 0,
	@pAnio varchar(10) = null
AS
BEGIN
	DECLARE @vIdCatalogo INT,@cols NVARCHAR(MAX),
        @sql NVARCHAR(MAX)

	IF @pBandera = 'SELECT'
BEGIN
	;WITH DiasEtapas AS (
		SELECT 
			o.IdOportunidad,
			o.IdProspecto,
			DATEDIFF(DAY, o.FechaModificacion, GETDATE()) AS DiasSinActividad,
			-- Etapa 1
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 2),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 2 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 2)
				), GETDATE())
			), 0) AS DiasEtapa1,

			-- Etapa 2
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 3),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 3 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 3)
				), GETDATE())
			), 0) AS DiasEtapa2,

			-- Etapa 3
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 4),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 4 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 4)
				), GETDATE())
			), 0) AS DiasEtapa3,

			-- Etapa 4
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 5),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 5 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 5)
				), GETDATE())
			), 0) AS DiasEtapa4,

			-- Etapa 5
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 6),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 6 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 6)
				), GETDATE())
			), 0) AS DiasEtapa5

		FROM Oportunidades o
		WHERE o.IdEmpresa = @pIdEmpresa
	)
	SELECT 
		P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
		CASE WHEN P.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus, 
		S.NombreSector, P.IdSector,
		COUNT(o.IdOportunidad) as TotalOportunidades,

		-- Conteos por estatus
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdEmpresa = @pIdEmpresa AND o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 1) as Proceso,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdEmpresa = @pIdEmpresa AND o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 2) as Ganadas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdEmpresa = @pIdEmpresa AND o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 3) as Perdidas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdEmpresa = @pIdEmpresa AND o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 4) as Canceladas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdEmpresa = @pIdEmpresa AND o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 5) as Eliminadas,

		-- Porcentaje de efectividad
		CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0
			ELSE CONVERT(DECIMAL(10, 2), (
				(SELECT COUNT(*) FROM Oportunidades o2 
					WHERE o2.IdEmpresa = @pIdEmpresa 
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 2
				) * 100.0 / COUNT(o.IdOportunidad))
			)
		END as PorcEfectividad,

		-- Promedios de días por etapa y sin actividad por prospecto
		ISNULL(AVG(de.DiasEtapa1), 0) AS PromDiasEtapa1,
		ISNULL(AVG(de.DiasEtapa2), 0) AS PromDiasEtapa2,
		ISNULL(AVG(de.DiasEtapa3), 0) AS PromDiasEtapa3,
		ISNULL(AVG(de.DiasEtapa4), 0) AS PromDiasEtapa4,
		ISNULL(AVG(de.DiasEtapa5), 0) AS PromDiasEtapa5,
		ISNULL(AVG(de.DiasSinActividad), 0) AS PromDiasSinActividad

	FROM Prospectos P
	LEFT JOIN Sectores S ON P.IdSector = S.IdSector
	LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
	LEFT JOIN DiasEtapas de ON o.IdOportunidad = de.IdOportunidad
	WHERE P.IdEmpresa = @pIdEmpresa
	GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector

	ORDER BY P.Nombre ASC
END

	IF @pBandera = 'COLUMNAS-ADICIONALES'
	BEGIN
		
		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER('Prospectos'))

		SELECT I.Nombre NombreCampo FROM InputsAdicionales I
		JOIN R_InputsCatalogo RI ON RI.InputId = I.Id AND RI.Activo = 1 AND RI.CatalogoId = @vIdCatalogo AND RI.IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'COLUMNAS-ADICIONALES-DATA'
	BEGIN

		SET @vIdCatalogo = (SELECT Id FROM ConfiguracionTablas WHERE LOWER(NombreTabla) = LOWER('Prospectos'))

		-- Obtener columnas dinámicas desde los inputs adicionales
		SELECT @cols = STRING_AGG(QUOTENAME(I.Nombre), ',')
		FROM InputsAdicionales I
		JOIN R_InputsCatalogo RI ON I.Id = RI.InputId
		WHERE RI.CatalogoId = @vIdCatalogo AND RI.Activo = 1

		SET @sql = '
			SELECT 
				P.IdProspecto, 
				P.Nombre, 
				' + @cols + '
			FROM Prospectos P
			LEFT JOIN (
				SELECT 
					IAD.ReferenciaId, 
					I.Nombre, 
					IAD.Valor
				FROM InputsAdicionalesData IAD
				JOIN R_InputsCatalogo RI ON RI.Id = IAD.RCatalogoInputId 
					AND RI.CatalogoId = @pIdCatalogo 
					AND RI.Activo = 1
				JOIN InputsAdicionales I ON I.Id = RI.InputId
			) SRC
			PIVOT (
				MAX(Valor) FOR Nombre IN (' + @cols + ')
			) AS PVT ON P.IdProspecto = PVT.ReferenciaId
			WHERE P.IdEmpresa = @pIdEmpresa;
			';

		-- Ejecutar
		EXEC sp_executesql @sql, N'@pIdEmpresa INT, @pIdCatalogo INT', @pIdEmpresa = @pIdEmpresa, @pIdCatalogo = @vIdCatalogo;

	END

	IF @pBandera = 'SEL-REPETIDOS'
	BEGIN
		SELECT Nombre, Estatus
		FROM Prospectos 
		WHERE IdProspecto != @IdProspecto AND IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO Prospectos (Nombre, UbicacionFisica, Estatus, FechaRegistro, IdEmpresa,IdSector) VALUES
							 (@Nombre, @UsbicacionFisica, 1, GETDATE(), @pIdEmpresa,@pIdSector)
		SELECT SCOPE_IDENTITY() AS IdProspecto;
	END

	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE Prospectos SET Nombre = CASE WHEN @Nombre IS NULL THEN Nombre ELSE @Nombre END, 
							UbicacionFisica = CASE WHEN @UsbicacionFisica IS NULL THEN UbicacionFisica ELSE @UsbicacionFisica END, 
							Estatus = @Estatus, IdSector = @pIdSector
							WHERE IdProspecto = @IdProspecto
	END

	IF @pBandera = 'SELECT_CMB'
	BEGIN
		
		SELECT DISTINCT p.IdProspecto,p.Nombre,UbicacionFisica,p.Estatus, CASE WHEN p.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus
		FROM ContactosProspectos c 
		LEFT JOIN Prospectos p ON c.IdProspecto = p.IdProspecto
		WHERE c.IdEmpresa =  @pIdEmpresa
		ORDER BY p.Nombre
	END

	IF @pBandera = 'SELECT-TOPVEINTE'
	BEGIN
	SELECT * FROM (
		SELECT TOP 20 P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
		CASE WHEN P.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus, 
		S.NombreSector, P.IdSector,
		COUNT(o.IdOportunidad) as TotalOportunidades,
		(SELECT COUNT(nombreOportunidad) 
		FROM oportunidades o2
		WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto 
			AND o2.IdEstatusOportunidad = 1
		) as Proceso,
	   
		(SELECT COUNT(nombreOportunidad) 
		FROM oportunidades o2
		WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto 
			AND o2.IdEstatusOportunidad = 2
		) as Ganadas,
	   
		(SELECT COUNT(nombreOportunidad) 
		FROM oportunidades o2
		WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto 
			AND o2.IdEstatusOportunidad = 3
		) as Perdidas,
	   
		(SELECT COUNT(nombreOportunidad) 
		FROM oportunidades o2
		WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto 
			AND o2.IdEstatusOportunidad = 4
		) as Canceladas,
	   
		(SELECT COUNT(nombreOportunidad) 
		FROM oportunidades o2
		WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto 
			AND o2.IdEstatusOportunidad = 5
		) as Eliminadas,
		(
		  SELECT MAX(o2.FechaRegistro)
		  FROM oportunidades o2
		  WHERE o2.IdEmpresa = @pIdEmpresa
			AND o2.IdProspecto = P.IdProspecto
		) AS UltimaFecha,
		
		 --Columnas de Porcentaje
			CASE 
					WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
						ELSE CONVERT(DECIMAL(10, 2), (
										SELECT COUNT(nombreOportunidad) 
										FROM oportunidades o2
										WHERE o2.IdEmpresa = @pIdEmpresa
										AND o2.IdProspecto = P.IdProspecto 
										AND o2.IdEstatusOportunidad = 2
								) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcGanadas,
			
			CASE 
					WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
						ELSE CONVERT(DECIMAL(10, 2), (
							SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 3
						) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcPerdidas,
			
			CASE 
					WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
						ELSE CONVERT(DECIMAL(10, 2), (
							SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 4
						) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcCanceladas,
			
			CASE 
					WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
						ELSE CONVERT(DECIMAL(10, 2), (
							SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 5
						) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcEliminadas
			
			
		FROM Prospectos P
		LEFT JOIN Sectores S ON P.IdSector = S.IdSector
		LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
		WHERE P.IdEmpresa = @pIdEmpresa
		--AND P.Estatus = 1
		GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector
		ORDER BY PorcGanadas DESC) AS top20
		ORDER BY PorcGanadas DESC, TotalOportunidades DESC, Nombre ASC;
	END

	IF @pBandera = 'SELECT-TOPVEINTE-POR-ANIO'
	BEGIN
		SELECT * FROM (
			SELECT TOP 20 P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
			CASE WHEN P.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus, 
			S.NombreSector, P.IdSector,
			COUNT(o.IdOportunidad) as TotalOportunidades,
			(SELECT COUNT(nombreOportunidad) 
			FROM oportunidades o2
			WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto 
				AND o2.IdEstatusOportunidad = 1
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio) 
			) as Proceso,
	   
			(SELECT COUNT(nombreOportunidad) 
			FROM oportunidades o2
			WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto 
				AND o2.IdEstatusOportunidad = 2
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) as Ganadas,
	   
			(SELECT COUNT(nombreOportunidad) 
			FROM oportunidades o2
			WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto 
				AND o2.IdEstatusOportunidad = 3
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) as Perdidas,
	   
			(SELECT COUNT(nombreOportunidad) 
			FROM oportunidades o2
			WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto 
				AND o2.IdEstatusOportunidad = 4
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) as Canceladas,
	   
			(SELECT COUNT(nombreOportunidad) 
			FROM oportunidades o2
			WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto 
				AND o2.IdEstatusOportunidad = 5
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) as Eliminadas,
			(
			  SELECT MAX(o2.FechaRegistro)
			  FROM oportunidades o2
			  WHERE o2.IdEmpresa = @pIdEmpresa
				AND o2.IdProspecto = P.IdProspecto
				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) AS UltimaFecha,
		
			--Columnas de Porcentaje
			CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
			ELSE CONVERT(DECIMAL(10, 2), (
							SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 2
							AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
					) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcGanadas,
			
			CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
			ELSE CONVERT(DECIMAL(10, 2), (
				SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 3
					AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcPerdidas,
			
			CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
			ELSE CONVERT(DECIMAL(10, 2), (
				SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 4
					AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcCanceladas,
			
			CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
			ELSE CONVERT(DECIMAL(10, 2), (
				SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 5
					AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
			) * 100.0 / COUNT(o.IdOportunidad))
			END AS PorcEliminadas		
			
			FROM Prospectos P
			JOIN Sectores S ON P.IdSector = S.IdSector
			JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio) 
			WHERE P.IdEmpresa = @pIdEmpresa
			--AND P.Estatus = 1
			GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector
			ORDER BY PorcGanadas DESC
		) AS top20
		WHERE top20.TotalOportunidades > 0 AND (top20.Ganadas > 0 OR top20.Perdidas > 0 OR top20.Eliminadas > 0 OR top20.Canceladas > 0)
		ORDER BY PorcGanadas DESC, TotalOportunidades DESC, Nombre ASC;
	END

	IF @pBandera = 'SELECT-TOPVEINTE-SECTORES2'
		BEGIN
			SELECT S.NombreSector,
				 COUNT(TopProspectos.IdProspecto) as TotalOportunidadesSector,
				 SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) as Ganadas,
				 SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) * 100.0 
				 / COUNT(TopProspectos.IdProspecto) as PorcGanadas
	 
			FROM (
					SELECT TOP 20 P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, P.IdSector
					FROM Prospectos P
					WHERE P.IdEmpresa = @pIdEmpresa
					ORDER BY (SELECT COUNT(*) FROM Oportunidades o WHERE o.IdProspecto = P.IdProspecto) DESC
			) AS TopProspectos
			LEFT JOIN Sectores S ON TopProspectos.IdSector = S.IdSector
			LEFT JOIN Oportunidades o ON TopProspectos.IdProspecto = o.IdProspecto 
				AND o.IdEmpresa = @pIdEmpresa
			GROUP BY S.NombreSector
			ORDER BY TotalOportunidadesSector DESC;
		END
		
		
		IF @pBandera = 'SELECT-TOPVEINTE-SECTORES'
			BEGIN
				SELECT *
				FROM (
					SELECT *,
							(SELECT SUM(TotalOportunidadesSector) FROM (
									SELECT COUNT(TopProspectos.IdProspecto) as TotalOportunidadesSector
									FROM (
											/*SELECT TOP 20 P.IdProspecto, 
													P.Nombre, 
													P.UbicacionFisica, 
													P.Estatus, 
													P.IdSector
											FROM Prospectos P
											WHERE P.IdEmpresa = @pIdEmpresa
											ORDER BY 
											(SELECT COUNT(*) FROM Oportunidades o 
												WHERE o.IdProspecto = P.IdProspecto) DESC*/
												SELECT TOP 20 P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
														CASE WHEN P.Estatus = 1 THEN 'Activo' 
															ELSE 'Inactivo' END as DesEstatus, 
														S.NombreSector, P.IdSector,
														COUNT(o.IdOportunidad) as TotalOportunidades,
														(SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
															AND o2.IdProspecto = P.IdProspecto 
															AND o2.IdEstatusOportunidad = 1
															AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
														) as Proceso,
																		 
														(SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
															AND o2.IdProspecto = P.IdProspecto 
															AND o2.IdEstatusOportunidad = 2
															AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
														) as Ganadas,
																		 
														(SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
															AND o2.IdProspecto = P.IdProspecto 
															AND o2.IdEstatusOportunidad = 3
															AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
														) as Perdidas,
																		 
														(SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
															AND o2.IdProspecto = P.IdProspecto 
															AND o2.IdEstatusOportunidad = 4
															AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
														) as Canceladas,
																		 
														(SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
															AND o2.IdProspecto = P.IdProspecto 
															AND o2.IdEstatusOportunidad = 5
															AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
														) as Eliminadas, 
																		
															--Columnas de Porcentaje
															CASE 
																	WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
																		ELSE CONVERT(DECIMAL(10, 2), (
																						SELECT COUNT(nombreOportunidad) 
																						FROM oportunidades o2
																						WHERE o2.IdEmpresa = @pIdEmpresa
																						AND o2.IdProspecto = P.IdProspecto 
																						AND o2.IdEstatusOportunidad = 2
																						AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
																				) * 100.0 / COUNT(o.IdOportunidad))
															END AS PorcGanadas,
																			
															CASE 
																	WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
																		ELSE CONVERT(DECIMAL(10, 2), (
																			SELECT COUNT(nombreOportunidad) 
																			FROM oportunidades o2
																			WHERE o2.IdEmpresa = @pIdEmpresa
																				AND o2.IdProspecto = P.IdProspecto 
																				AND o2.IdEstatusOportunidad = 3
																				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
																		) * 100.0 / COUNT(o.IdOportunidad))
															END AS PorcPerdidas,
																			
															CASE 
																	WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
																		ELSE CONVERT(DECIMAL(10, 2), (
																			SELECT COUNT(nombreOportunidad) 
																			FROM oportunidades o2
																			WHERE o2.IdEmpresa = @pIdEmpresa
																				AND o2.IdProspecto = P.IdProspecto 
																				AND o2.IdEstatusOportunidad = 4
																				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
																		) * 100.0 / COUNT(o.IdOportunidad))
															END AS PorcCanceladas,
																			
															CASE 
																	WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
																		ELSE CONVERT(DECIMAL(10, 2), (
																			SELECT COUNT(nombreOportunidad) 
																			FROM oportunidades o2
																			WHERE o2.IdEmpresa = @pIdEmpresa
																				AND o2.IdProspecto = P.IdProspecto 
																				AND o2.IdEstatusOportunidad = 5
																				AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
																		) * 100.0 / COUNT(o.IdOportunidad))
															END AS PorcEliminadas
																			
																			
														FROM Prospectos P
														LEFT JOIN Sectores S ON P.IdSector = S.IdSector
														LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
														WHERE P.IdEmpresa = @pIdEmpresa
														--AND P.Estatus = 1
														GROUP BY P.IdProspecto, 
																			P.Nombre, 
																			P.UbicacionFisica, 
																			P.Estatus, 
																			S.NombreSector, 
																			P.IdSector
														ORDER BY PorcGanadas DESC
		
									) AS TopProspectos
									LEFT JOIN Sectores S ON TopProspectos.IdSector = S.IdSector
									LEFT JOIN Oportunidades o ON TopProspectos.IdProspecto = o.IdProspecto
										AND o.IdEmpresa = @pIdEmpresa AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
									GROUP BY S.NombreSector
									HAVING SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) 
									* 100.0 / COUNT(TopProspectos.IdProspecto) >= 50
							) AS Subquery) as TotalOportunidades
					FROM (
							SELECT S.NombreSector,
									COUNT(TopProspectos.IdProspecto) as TotalOportunidadesSector,
									SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) as Ganadas,
									SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) 
									* 100.0 / COUNT(TopProspectos.IdProspecto) as PorcGanadas,
									CONVERT(DECIMAL(10, 2), COUNT(TopProspectos.IdProspecto) * 100.0 
									/ SUM(COUNT(TopProspectos.IdProspecto)) OVER ()) as Porcentaje
							FROM (
									/*SELECT TOP 20 
										P.IdProspecto, 
										P.Nombre, 
										P.UbicacionFisica, 
										P.Estatus, 
										P.IdSector
									FROM Prospectos P
									WHERE P.IdEmpresa = @pIdEmpresa
									ORDER BY 
										(SELECT COUNT(*) FROM Oportunidades o 
											WHERE o.IdProspecto = P.IdProspecto) DESC*/
										SELECT TOP 20 P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
											CASE WHEN P.Estatus = 1 THEN 'Activo' 
												ELSE 'Inactivo' END as DesEstatus, 
											S.NombreSector, P.IdSector,
											COUNT(o.IdOportunidad) as TotalOportunidades,
											(SELECT COUNT(nombreOportunidad) 
											FROM oportunidades o2
											WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 1
												AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
											) as Proceso,
																		 
											(SELECT COUNT(nombreOportunidad) 
											FROM oportunidades o2
											WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 2
												AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
											) as Ganadas,
																		 
											(SELECT COUNT(nombreOportunidad) 
											FROM oportunidades o2
											WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 3
												AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
											) as Perdidas,
																		 
											(SELECT COUNT(nombreOportunidad) 
											FROM oportunidades o2
											WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 4
												AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
											) as Canceladas,
																		 
											(SELECT COUNT(nombreOportunidad) 
											FROM oportunidades o2
											WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 5
												AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
											) as Eliminadas, 
																		
												--Columnas de Porcentaje
												CASE 
														WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
															ELSE CONVERT(DECIMAL(10, 2), (
																			SELECT COUNT(nombreOportunidad) 
																			FROM oportunidades o2
																			WHERE o2.IdEmpresa = @pIdEmpresa
																			AND o2.IdProspecto = P.IdProspecto 
																			AND o2.IdEstatusOportunidad = 2
																			AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
																	) * 100.0 / COUNT(o.IdOportunidad))
												END AS PorcGanadas,
																			
												CASE 
														WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
															ELSE CONVERT(DECIMAL(10, 2), (
																SELECT COUNT(nombreOportunidad) 
																FROM oportunidades o2
																WHERE o2.IdEmpresa = @pIdEmpresa
																	AND o2.IdProspecto = P.IdProspecto 
																	AND o2.IdEstatusOportunidad = 3
																	AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
															) * 100.0 / COUNT(o.IdOportunidad))
												END AS PorcPerdidas,
																			
												CASE 
														WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
															ELSE CONVERT(DECIMAL(10, 2), (
																SELECT COUNT(nombreOportunidad) 
																FROM oportunidades o2
																WHERE o2.IdEmpresa = @pIdEmpresa
																	AND o2.IdProspecto = P.IdProspecto 
																	AND o2.IdEstatusOportunidad = 4
																	AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
															) * 100.0 / COUNT(o.IdOportunidad))
												END AS PorcCanceladas,
																			
												CASE 
														WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
															ELSE CONVERT(DECIMAL(10, 2), (
																SELECT COUNT(nombreOportunidad) 
																FROM oportunidades o2
																WHERE o2.IdEmpresa = @pIdEmpresa
																	AND o2.IdProspecto = P.IdProspecto 
																	AND o2.IdEstatusOportunidad = 5
																	AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
															) * 100.0 / COUNT(o.IdOportunidad))
												END AS PorcEliminadas
																			
																			
											FROM Prospectos P
											LEFT JOIN Sectores S ON P.IdSector = S.IdSector
											LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
											WHERE P.IdEmpresa = @pIdEmpresa
											--AND P.Estatus = 1
											GROUP BY P.IdProspecto, 
																P.Nombre, 
																P.UbicacionFisica, 
																P.Estatus, 
																S.NombreSector, 
																P.IdSector
											ORDER BY PorcGanadas DESC
							) AS TopProspectos
							LEFT JOIN Sectores S ON TopProspectos.IdSector = S.IdSector
							LEFT JOIN Oportunidades o ON TopProspectos.IdProspecto = o.IdProspecto 
								AND o.IdEmpresa = @pIdEmpresa AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
							GROUP BY S.NombreSector
							HAVING SUM(CASE WHEN o.IdEstatusOportunidad = 2 THEN 1 ELSE 0 END) * 100.0 
							/ COUNT(TopProspectos.IdProspecto) >= 50
					) AS MainQuery
			) AS FinalQuery
			ORDER BY TotalOportunidadesSector DESC
			END

		
		IF @pBandera = 'SELECT-TOPVEINTE-MAYOR-50%'
			BEGIN
				SELECT * FROM (
					SELECT TOP 20 P.IdProspecto, P.Nombre,
				COUNT(o.IdOportunidad) as TotalOportunidades,
				(SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 1
				) as Proceso,
				 
				(SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 2
				) as Ganadas,
				 
				(SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 3
				) as Perdidas,
				 
				(SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 4
				) as Canceladas,
				 
				(SELECT COUNT(nombreOportunidad) 
				FROM oportunidades o2
				WHERE o2.IdEmpresa = @pIdEmpresa
					AND o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 5
				) as Eliminadas, 
				
				 --Columnas de Porcentaje
					CASE 
							WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
								ELSE CONVERT(DECIMAL(10, 2), (
												SELECT COUNT(nombreOportunidad) 
												FROM oportunidades o2
												WHERE o2.IdEmpresa = @pIdEmpresa
												AND o2.IdProspecto = P.IdProspecto 
												AND o2.IdEstatusOportunidad = 2
										) * 100.0 / COUNT(o.IdOportunidad))
					END AS PorcGanadas,
					
					CASE 
							WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
								ELSE CONVERT(DECIMAL(10, 2), (
									SELECT COUNT(nombreOportunidad) 
									FROM oportunidades o2
									WHERE o2.IdEmpresa = @pIdEmpresa
										AND o2.IdProspecto = P.IdProspecto 
										AND o2.IdEstatusOportunidad = 3
								) * 100.0 / COUNT(o.IdOportunidad))
					END AS PorcPerdidas,
					
					CASE 
							WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
								ELSE CONVERT(DECIMAL(10, 2), (
									SELECT COUNT(nombreOportunidad) 
									FROM oportunidades o2
									WHERE o2.IdEmpresa = @pIdEmpresa
										AND o2.IdProspecto = P.IdProspecto 
										AND o2.IdEstatusOportunidad = 4
								) * 100.0 / COUNT(o.IdOportunidad))
					END AS PorcCanceladas,
					
					CASE 
							WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
								ELSE CONVERT(DECIMAL(10, 2), (
									SELECT COUNT(nombreOportunidad) 
									FROM oportunidades o2
									WHERE o2.IdEmpresa = @pIdEmpresa
										AND o2.IdProspecto = P.IdProspecto 
										AND o2.IdEstatusOportunidad = 5
								) * 100.0 / COUNT(o.IdOportunidad))
					END AS PorcEliminadas
					
					
				FROM Prospectos P
				LEFT JOIN Sectores S ON P.IdSector = S.IdSector AND p.IdEmpresa = @pIdEmpresa
				LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND p.IdEmpresa = @pIdEmpresa
				WHERE P.IdEmpresa = @pIdEmpresa
				--AND P.Estatus = 1
				GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector
				ORDER BY TotalOportunidades DESC
				) AS subconsulta
				WHERE PorcGanadas >= 50;
			END
			
		IF @pBandera = 'SELECT-TOPDIEZ-CLIENTES3'
		BEGIN
		SELECT * FROM (
				SELECT TOP 10 P.IdProspecto, P.Nombre, 
						COUNT(o.IdOportunidad) as OportunidadesSolicitadas,
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 1
						) as Proceso,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 2
						) as Ganadas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 3
						) as Perdidas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 4
						) as Canceladas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 5
						) as Eliminadas, 
							
						CASE 
								WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
									ELSE CONVERT(DECIMAL(10, 2), (
													SELECT COUNT(nombreOportunidad) 
													FROM oportunidades o2
													WHERE o2.IdEmpresa = @pIdEmpresa
													AND o2.IdProspecto = P.IdProspecto 
													AND o2.IdEstatusOportunidad = 2
											) * 100.0 / COUNT(o.IdOportunidad))
						END AS PorcGanadas
									
						FROM Prospectos P
						LEFT JOIN Sectores S ON P.IdSector = S.IdSector
						LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
						WHERE P.IdEmpresa = @pIdEmpresa
						--AND P.Estatus = 1
						GROUP BY P.IdProspecto, 
											P.Nombre, 
											P.UbicacionFisica, 
											P.Estatus, 
											S.NombreSector, 
											P.IdSector
						--ORDER BY PorcGanadas DESC, TotalOportunidades DESC
						ORDER BY PorcGanadas DESC 
		) AS Top10
		WHERE PorcGanadas >= 50
		ORDER BY PorcGanadas DESC, OportunidadesSolicitadas DESC;
		END
			
		IF @pBandera = 'SELECT-TOPDIEZ-CLIENTES'
		BEGIN
		SELECT TOP 10 * FROM (
				SELECT TOP 20 P.IdProspecto, P.Nombre, 
						COUNT(o.IdOportunidad) as OportunidadesSolicitadas,
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 1
						) as Proceso,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 2
						) as Ganadas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 3
						) as Perdidas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 4
						) as Canceladas,
							 
						(SELECT COUNT(nombreOportunidad) 
						FROM oportunidades o2
						WHERE o2.IdEmpresa = @pIdEmpresa
							AND o2.IdProspecto = P.IdProspecto 
							AND o2.IdEstatusOportunidad = 5
						) as Eliminadas, 
							
						CASE 
								WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
									ELSE CONVERT(DECIMAL(10, 2), (
													SELECT COUNT(nombreOportunidad) 
													FROM oportunidades o2
													WHERE o2.IdEmpresa = @pIdEmpresa
													AND o2.IdProspecto = P.IdProspecto 
													AND o2.IdEstatusOportunidad = 2
											) * 100.0 / COUNT(o.IdOportunidad))
						END AS PorcGanadas
									
						FROM Prospectos P
						LEFT JOIN Sectores S ON P.IdSector = S.IdSector
						LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
						WHERE P.IdEmpresa = @pIdEmpresa
						--AND P.Estatus = 1
						GROUP BY P.IdProspecto, 
											P.Nombre, 
											P.UbicacionFisica, 
											P.Estatus, 
											S.NombreSector, 
											P.IdSector
						--ORDER BY PorcGanadas DESC, TotalOportunidades DESC
						ORDER BY PorcGanadas DESC 
		) AS Top10
		WHERE PorcGanadas >= 50
		ORDER BY PorcGanadas DESC, OportunidadesSolicitadas DESC, Nombre ASC;
		END

		IF @pBandera = 'SELECT-TOPDIEZ-CLIENTES-ORDER'
		BEGIN
			SELECT TOP 10 * FROM (
					SELECT TOP 20 P.IdProspecto, P.Nombre, 
							COUNT(o.IdOportunidad) as OportunidadesSolicitadas,
							(SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 1
								AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
							) as Proceso,
							 
							(SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 2
								AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
							) as Ganadas,
							 
							(SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 3
								AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
							) as Perdidas,
							 
							(SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 4
								AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
							) as Canceladas,
							 
							(SELECT COUNT(nombreOportunidad) 
							FROM oportunidades o2
							WHERE o2.IdEmpresa = @pIdEmpresa
								AND o2.IdProspecto = P.IdProspecto 
								AND o2.IdEstatusOportunidad = 5
								AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
							) as Eliminadas, 
							
							CASE 
									WHEN COUNT(o.IdOportunidad) = 0 THEN 0 
										ELSE CONVERT(DECIMAL(10, 2), (
														SELECT COUNT(nombreOportunidad) 
														FROM oportunidades o2
														WHERE o2.IdEmpresa = @pIdEmpresa
														AND o2.IdProspecto = P.IdProspecto 
														AND o2.IdEstatusOportunidad = 2
														AND ( @pAnio IS NULL OR YEAR(o2.FechaRegistro) = @pAnio)
												) * 100.0 / COUNT(o.IdOportunidad))
							END AS PorcGanadas
									
							FROM Prospectos P
							LEFT JOIN Sectores S ON P.IdSector = S.IdSector
							LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
							WHERE P.IdEmpresa = @pIdEmpresa
							--AND P.Estatus = 1
							GROUP BY P.IdProspecto, 
												P.Nombre, 
												P.UbicacionFisica, 
												P.Estatus, 
												S.NombreSector, 
												P.IdSector
							--ORDER BY PorcGanadas DESC, TotalOportunidades DESC
							ORDER BY PorcGanadas DESC 
			) AS Top10
			WHERE PorcGanadas >= 50
			ORDER BY OportunidadesSolicitadas DESC, Ganadas DESC, Nombre ASC;
	END

	IF @pBandera = 'ANIOS-OPORTUNIDADES'
	BEGIN
		SELECT YEAR(o.FechaRegistro)Anio
		FROM Prospectos P
		JOIN Sectores S ON P.IdSector = S.IdSector
		JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto 
		WHERE P.IdEmpresa = @pIdEmpresa
		GROUP BY YEAR(o.FechaRegistro)
		ORDER BY Anio DESC
	END

	IF @pBandera = 'ANIOS-TOP-20'
	BEGIN
		SELECT YEAR(o.FechaRegistro)Anio
		FROM Prospectos P
		JOIN Sectores S ON P.IdSector = S.IdSector
		JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto AND o.IdEstatusOportunidad = 2 
		WHERE P.IdEmpresa = @pIdEmpresa AND P.IdProspecto IN(
			SELECT TOP 20 P.IdProspecto	
			FROM Prospectos P
			LEFT JOIN Sectores S ON P.IdSector = S.IdSector
			LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto --AND ( @pAnio IS NULL OR YEAR(o.FechaRegistro) = @pAnio)
			WHERE P.IdEmpresa = @pIdEmpresa --AND S.IdSector = 13
			--AND P.Estatus = 1
			GROUP BY P.IdProspecto, 
								P.Nombre, 
								P.UbicacionFisica, 
								P.Estatus, 
								S.NombreSector, 
								P.IdSector
		)
		GROUP BY YEAR(o.FechaRegistro)
		ORDER BY Anio DESC
	END
	--IF @pBandera = 'UPDATE-NIVEL-INTERES'
	--BEGIN
	--	UPDATE Prospectos
	--	SET IdNivel = @pIdNivel,
	--		FechaModificacion = GETDATE()
	--	WHERE IdProspecto = @IdProspecto
	--END
	IF @pBandera = 'SELECT-PROSPECTOS-GENERAL'
BEGIN
	;WITH DiasEtapas AS (
		SELECT 
			o.IdOportunidad,
			o.IdProspecto,
			DATEDIFF(DAY, o.FechaModificacion, GETDATE()) AS DiasSinActividad,

			-- Etapa 1
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 2),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 2 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 2)
				), GETDATE())
			), 0) AS DiasEtapa1,

			-- Etapa 2
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 3),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 3 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 3)
				), GETDATE())
			), 0) AS DiasEtapa2,

			-- Etapa 3
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 4),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 4 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 4)
				), GETDATE())
			), 0) AS DiasEtapa3,

			-- Etapa 4
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 5),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 5 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 5)
				), GETDATE())
			), 0) AS DiasEtapa4,

			-- Etapa 5
			ISNULL(DATEDIFF(DAY,
				(SELECT MIN(FechaRegistro) FROM BitacoraOportunidades WHERE IdOportunidad = o.IdOportunidad AND IdStage = 6),
				ISNULL((SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
						WHERE IdOportunidad = o.IdOportunidad AND IdStage != 6 
						  AND FechaRegistro > (SELECT MIN(FechaRegistro) FROM BitacoraOportunidades 
												WHERE IdOportunidad = o.IdOportunidad AND IdStage = 6)
				), GETDATE())
			), 0) AS DiasEtapa5

		FROM Oportunidades o
	)
	SELECT 
		P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
		CASE WHEN P.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus, 
		S.NombreSector, P.IdSector,
		COUNT(o.IdOportunidad) as TotalOportunidades,

		-- Conteos por estatus
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 1) as Proceso,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 2) as Ganadas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 3) as Perdidas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 4) as Canceladas,
		(SELECT COUNT(*) FROM Oportunidades o2 WHERE o2.IdProspecto = P.IdProspecto AND o2.IdEstatusOportunidad = 5) as Eliminadas,

		-- Porcentaje de efectividad
		CASE 
			WHEN COUNT(o.IdOportunidad) = 0 THEN 0
			ELSE CONVERT(DECIMAL(10, 2), (
				(SELECT COUNT(*) FROM Oportunidades o2 
					WHERE o2.IdProspecto = P.IdProspecto 
					AND o2.IdEstatusOportunidad = 2
				) * 100.0 / COUNT(o.IdOportunidad))
			)
		END as PorcEfectividad,

		-- Promedios de días por etapa y sin actividad por prospecto
		ISNULL(AVG(de.DiasEtapa1), 0) AS PromDiasEtapa1,
		ISNULL(AVG(de.DiasEtapa2), 0) AS PromDiasEtapa2,
		ISNULL(AVG(de.DiasEtapa3), 0) AS PromDiasEtapa3,
		ISNULL(AVG(de.DiasEtapa4), 0) AS PromDiasEtapa4,
		ISNULL(AVG(de.DiasEtapa5), 0) AS PromDiasEtapa5,
		ISNULL(AVG(de.DiasSinActividad), 0) AS PromDiasSinActividad

	FROM Prospectos P
	LEFT JOIN Sectores S ON P.IdSector = S.IdSector
	LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
	LEFT JOIN DiasEtapas de ON o.IdOportunidad = de.IdOportunidad
	GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector

	ORDER BY P.Nombre ASC
END

END


GO
/****** Object:  StoredProcedure [dbo].[F_ConfiguracionColumnas_ConsultarColumnasPorIdTabla]    Script Date: 31/07/2025 04:19:12 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2025-07-07
-- Description:	Consulta de columnas por IdTabla. Si el usaurio no tiene registrada una configuracion personal se trae la consulta por default 
-- =============================================
ALTER PROCEDURE [dbo].[F_ConfiguracionColumnas_ConsultarColumnasPorIdTabla]
	@pIdTabla INT = 0,
	@pIdUsuario INT = 0
AS
BEGIN
	DECLARE @vNombreTabla varchar(250) = null
	SET @vNombreTabla = (SELECT UPPER(NombreTabla) FROM ConfiguracionTablas WHERE Id = @pIdTabla)
	
	IF EXISTS (SELECT IdTabla FROM RelacionConfiguracionColumnasUsuario WHERE IdTabla = @pIdTabla AND IdUsuario = @pIdUsuario)
	BEGIN
		IF @vNombreTabla IN ('PROSPECTOS','CONTACTOS')
		BEGIN

			SELECT	
				T.IdColumna, C.Llave, C.Valor, C.TipoFormato, IsChecked, IsIgnore, IsTotal, GroupColumn, Orden 
			FROM RelacionConfiguracionColumnasUsuario T
			INNER JOIN ConfiguracionColumnas C ON C.Id = T.IdColumna
			WHERE IdTabla = @pIdTabla AND IdUsuario = @pIdUsuario
			UNION
			SELECT T.IdColumna, IAD.Llave, IAD.Valor, IAD.TipoFormato, T.IsChecked, T.IsIgnore, T.IsTotal, T.GroupColumn, IAD.Orden
			FROM
			RelacionConfiguracionColumnasUsuario T
			JOIN(
				SELECT 100000+IA.Id IdColumna, CNF.Llave, CNF.Valor, CNF.TipoFormato, CNF.IsChecked, CNF.IsIgnore, CNF.IsTotal, CNF.GroupColumn, 100000+R.Orden Orden
				FROM ConfiguracionColumnasInputsAdicionales CNF
				JOIN InputsAdicionales IA ON IA.Nombre = CNF.Llave
				JOIN R_InputsCatalogo R ON R.InputId = IA.Id AND R.Activo = 1
				JOIN ConfiguracionTablas CT ON CT.Id = R.CatalogoId AND CT.Id = @pIdTabla
			)IAD ON IAD.IdColumna = T.IdColumna
			WHERE T.IdTabla = @pIdTabla
			ORDER BY 9

		END
		ELSE
		BEGIN

			SELECT	
				T.IdColumna, C.Llave, C.Valor, C.TipoFormato, IsChecked, IsIgnore, IsTotal, GroupColumn 
			FROM RelacionConfiguracionColumnasUsuario T
			INNER JOIN ConfiguracionColumnas C ON C.Id = T.IdColumna
			WHERE IdTabla = @pIdTabla AND IdUsuario = @pIdUsuario
			ORDER BY Orden

		END		
	END
	ELSE
	BEGIN
		IF @vNombreTabla IN ('PROSPECTOS','CONTACTOS')
		BEGIN

			SELECT	
				T.IdColumna, C.Llave, C.Valor, C.TipoFormato, IsChecked, IsIgnore, IsTotal, GroupColumn, Orden 
			FROM ConfiguracionColumnasDefault T
			INNER JOIN ConfiguracionColumnas C ON C.Id = T.IdColumna
			WHERE IdTabla = @pIdTabla
			UNION
			SELECT 100000+IA.Id IdColumna, CNF.Llave, CNF.Valor, CNF.TipoFormato, CNF.IsChecked, CNF.IsIgnore, CNF.IsTotal, CNF.GroupColumn, 100000+R.Orden
			FROM ConfiguracionColumnasInputsAdicionales CNF
			JOIN InputsAdicionales IA ON IA.Nombre = CNF.Llave
			JOIN R_InputsCatalogo R ON R.InputId = IA.Id AND R.Activo = 1
			JOIN ConfiguracionTablas CT ON CT.Id = R.CatalogoId AND CT.Id = @pIdTabla
			ORDER BY 9

		END
		ELSE
		BEGIN

			SELECT	
				T.IdColumna, C.Llave, C.Valor, C.TipoFormato, IsChecked, IsIgnore, IsTotal, GroupColumn 
			FROM ConfiguracionColumnasDefault T
			INNER JOIN ConfiguracionColumnas C ON C.Id = T.IdColumna
			WHERE IdTabla = @pIdTabla 
			ORDER BY Orden

		END		
	END



END

