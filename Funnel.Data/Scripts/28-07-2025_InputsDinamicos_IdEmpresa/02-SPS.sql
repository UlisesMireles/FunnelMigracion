/****** Object:  StoredProcedure [dbo].[F_InputsAdicionales]    Script Date: 28/07/2025 12:53:00 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mario Canales
-- Create date: 27-06-2025
-- Description:	Operaciones relacionados a inputs dinamicos para prospectos y contactos
-- =============================================
CREATE OR ALTER   PROCEDURE [dbo].[F_InputsAdicionales] 
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
			JOIN CatalogosInputAdicionales TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.Descripcion) = LOWER(@pTipoCatalogoInput)
		) TMP1 ON TMP1.InputId = IA.Id
		WHERE IA.IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'SEL-INPUTS-CATALOGO'
	BEGIN
		SELECT  RIC.Id RCatalogoInputId,@pTipoCatalogoInput TipoCatalogoInput, RIC.Orden,RIC.Activo, 
			IA.Id IdInput, IA.Nombre, IA.Etiqueta, IA.Requerido, TC.Descripcion TipoCampo
		FROM InputsAdicionales IA
		JOIN TiposCampos TC ON TC.Id = IA.TipoCampoId
		JOIN R_InputsCatalogo RIC ON RIC.InputId = IA.Id AND RIC.Activo = 1 AND RIC.IdEmpresa = @pIdEmpresa
		JOIN CatalogosInputAdicionales TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.Descripcion) = LOWER(@pTipoCatalogoInput)
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
		JOIN CatalogosInputAdicionales TCI ON TCI.Id = RIC.CatalogoId AND LOWER(TCI.Descripcion) = LOWER(@pTipoCatalogoInput)
		LEFT JOIN InputsAdicionalesData D ON D.RCatalogoInputId = RIC.Id AND D.ReferenciaId = @pIdReferencia
		ORDER BY RIC.Orden ASC
	END

	IF @pBandera = 'INS-INPUT-ADICIONAL'
	BEGIN

		SET @vIdCatalogo = (SELECT Id FROM CatalogosInputAdicionales WHERE LOWER(Descripcion) = LOWER(@pTipoCatalogoInput))
		
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
