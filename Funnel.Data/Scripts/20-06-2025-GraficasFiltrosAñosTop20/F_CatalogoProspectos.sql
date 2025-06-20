USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CatalogoProspectos]    Script Date: 19/06/2025 12:52:36 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Consulta de catÃ¡logos
-- Update a consulta select para mostrar solo los prospectos que tienen contactos
-- Create date: 2025-04-25
-- Description:	Se añade calculo de porcentaje de efectividad en SELECT
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
	IF @pBandera = 'SELECT'
	BEGIN

SELECT P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, 
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
	   CASE 
               WHEN COUNT(o.IdOportunidad) = 0 THEN 0
               ELSE CONVERT(DECIMAL(10, 2), (
                   (SELECT COUNT(*) 
                    FROM oportunidades o2
                    WHERE o2.IdEmpresa = @pIdEmpresa
                      AND o2.IdProspecto = P.IdProspecto 
                      AND o2.IdEstatusOportunidad = 2
                   ) * 100.0 / COUNT(o.IdOportunidad))
			)
		END as PorcEfectividad
		

FROM Prospectos P
LEFT JOIN Sectores S ON P.IdSector = S.IdSector
LEFT JOIN Oportunidades o ON P.IdProspecto = o.IdProspecto
WHERE P.IdEmpresa = @pIdEmpresa
GROUP BY P.IdProspecto, P.Nombre, P.UbicacionFisica, P.Estatus, S.NombreSector, P.IdSector
ORDER BY P.Nombre ASC;

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
		ORDER BY PorcGanadas DESC) AS top20
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
	
END