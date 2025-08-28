/****** Object:  StoredProcedure [dbo].[F_CatalogoTiposOportunidades]    Script Date: 25/08/2025 06:03:39 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Catalogo de Tipos de Oportunidad (SELECT, INSERT, UPDATE, DELETE)
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoTiposOportunidades]
	@pBandera VARCHAR (20) = NULL,
	@pDescripcion VARCHAR (100) = NULL,
	@pAbreviatura VARCHAR (10) = NULL,
	@pIdTipoProyecto INT = 0,
	@pEstatus INT = 0,
	@pIdEmpresa int = 0
AS
BEGIN
	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO TiposOportunidad 
		(Descripcion, Abreviatura, FechaRegistro, Estatus, IdEmpresa)
		VALUES (@pDescripcion, @pAbreviatura, GETDATE(), 1, @pIdEmpresa)

		SELECT SCOPE_IDENTITY() AS IdTipoProyecto;

	END

	IF @pBandera = 'SELECT'
	BEGIN
		SELECT IdTipoProyecto, Descripcion, Abreviatura, Estatus, FechaModificacion,
		CASE WHEN Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus
		FROM TiposOportunidad WHERE IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'SEL-REPETIDOSUPDATE'
	BEGIN
		SELECT IdTipoProyecto, Descripcion, Abreviatura, Estatus, FechaModificacion,
		CASE WHEN Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus
		FROM TiposOportunidad
		WHERE IdTipoProyecto != @pIdTipoProyecto AND IdEmpresa = @pIdEmpresa
	END

	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE TiposOportunidad SET
		Descripcion = @pDescripcion,
		Abreviatura = @pAbreviatura,
		FechaModificacion = GETDATE(),
		Estatus = @pEstatus
		WHERE IdTipoProyecto = @pIdTipoProyecto

		SELECT @pIdTipoProyecto AS IdTipoProyecto;
	END

	IF @pBandera = 'DELETE'
	BEGIN
		UPDATE TiposOportunidad SET
		Estatus = @pEstatus,
		FechaModificacion = GETDATE()
		WHERE IdTipoProyecto = @pIdTipoProyecto
	END


	IF @pBandera = 'SEL-VALIDACION'
	BEGIN
		SELECT count(IdOportunidad) as cantidad FROM Oportunidades WHERE IdTipoProyecto = @pIdTipoProyecto AND IdEmpresa = @pIdEmpresa	
	END
	
END

/****** Object:  StoredProcedure [dbo].[F_CatalogoTiposEntrega]    Script Date: 26/08/2025 01:32:04 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[F_CatalogoTiposEntrega]
  @pBandera VARCHAR (20) = NULL,
  @pDescripcion VARCHAR (100) = NULL,
  @pAbreviatura VARCHAR (10) = NULL,
  @pIdTipoEntrega INT = 0,
  @pEstatus INT = 0,
  @pIdEmpresa INT = 0
AS
BEGIN
	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO TiposEntrega
		(Descripcion, Abreviatura, FechaRegistro, Estatus, IdEmpresa)
		VALUES (@pDescripcion, @pAbreviatura, GETDATE(), 1, @pIdEmpresa)

		SELECT SCOPE_IDENTITY() AS IdTipoEntrega;
	END

	IF @pBandera = 'SELECT'
	BEGIN
		SELECT IdTipoEntrega, Descripcion, Abreviatura, Estatus, FechaModificacion,
		CASE WHEN Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus
		FROM TiposEntrega WHERE IdEmpresa = @pIdEmpresa
	END
	
	IF @pBandera = 'SEL-REPETIDOSUPDATE'
	BEGIN
		SELECT IdTipoEntrega, Descripcion, Abreviatura, Estatus, FechaModificacion,
		CASE WHEN Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus
		FROM TiposEntrega
		WHERE IdTipoEntrega != @pIdTipoEntrega AND IdEmpresa = @pIdEmpresa
	END
	
	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE TiposEntrega SET
		Descripcion = @pDescripcion,
		Abreviatura = @pAbreviatura,
		FechaModificacion = GETDATE(),
		Estatus = @pEstatus
		WHERE IdTipoEntrega = @pIdTipoEntrega

		SELECT @pIdTipoEntrega AS IdTipoEntrega;
	END

	IF @pBandera = 'DELETE'
	BEGIN
		UPDATE TiposEntrega SET
		Estatus = @pEstatus,
		FechaModificacion = GETDATE()
		WHERE IdTipoEntrega = @pIdTipoEntrega
	END
END