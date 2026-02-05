--AGREGAR PROCENTAJE Y ORDEN A TABLA RELACION

ALTER TABLE [SFS-MASTER-COPIA].dbo.RelacionProcesoStage ADD PorcentajeAsignado int DEFAULT 0 NOT NULL;
ALTER TABLE [SFS-MASTER-COPIA].dbo.RelacionProcesoStage ADD Orden int DEFAULT 0 NOT NULL;

--ACTUALIZAR PORNCETAJE Y ORDEN CON VALORES DE StageOportunidades

UPDATE RPS
SET
	RPS.PorcentajeAsignado = R.PorcentajeAsignado,
	RPS.Orden = R.Stage
FROM RelacionProcesoStage RPS
JOIN(
	SELECT R.Id, S.Stage, S.PorcentajeAsignado FROM RelacionProcesoStage R
	JOIN StageOportunidad S ON S.Id = R.IdStage
)AS R ON R.Id = RPS.Id