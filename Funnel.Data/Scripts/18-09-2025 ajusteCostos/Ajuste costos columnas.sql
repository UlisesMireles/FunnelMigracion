
UPDATE [SFS-MASTER-QA].[dbo].[BitacoraPreguntas]
SET 
    [CostoPregunta] = [CostoPregunta] / 1000.0,
    [CostoRespuesta] = [CostoRespuesta] / 1000.0
WHERE IdBot IN (5,6,7);

UPDATE [SFS-MASTER-QA].[dbo].[BitacoraPreguntas]
SET 
    [CostoTotal] = [CostoPregunta] + [CostoRespuesta]
WHERE IdBot IN (5,6,7);
