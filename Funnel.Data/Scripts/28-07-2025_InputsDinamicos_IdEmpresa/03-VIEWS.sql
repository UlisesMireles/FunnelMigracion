
GO

/****** Object:  View [dbo].[ConfiguracionColumnasInputsAdicionales]    Script Date: 31/07/2025 04:21:34 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[ConfiguracionColumnasInputsAdicionales] AS
	SELECT 
		0 AS IdColumna,
		Nombre AS Llave,
		Etiqueta AS Valor,
		LOWER(TC.Descripcion) AS TipoFormato,
		0 AS IsChecked,
		0 AS IsIgnore, 
		0 AS IsTotal, 
		0 AS GroupColumn 
	FROM InputsAdicionales IA 
	LEFT JOIN R_InputsCatalogo RIC ON RIC.InputId = IA.Id AND RIC.Activo = 1
	LEFT JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId

GO


