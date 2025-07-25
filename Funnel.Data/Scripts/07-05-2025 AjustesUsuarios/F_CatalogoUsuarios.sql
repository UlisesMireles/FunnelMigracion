USE [SFS-MASTER-QA]
GO
/****** Object:  StoredProcedure [dbo].[F_CatalogoUsuarios]    Script Date: 07/05/2025 11:13:05 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Antonio Quezada
-- Create date: 2021-01-04
-- Description:	Consulta de catÃ¡logos
-- Update date: 11-04-2025
-- Description: Se agrego el campo de las iniciales en el update de los usuarios
-- Update date: 14-04-2025
-- Description: Se modifico el retorno del id al crear el usuario
-- Update date: 15-04-2025
-- Description: Se agrego el campo de usuario en el update de los usuarios
-- Author:		Lizbeth Morales
-- Update date: 29-04-2025
-- Description: Se agrego el if para cambiar solo el password
-- Author:		Evelin Gutierrez
-- Update date: 07-05-2025
-- Description: Se agrego el campo archivoimagen en select
-- =============================================
ALTER PROCEDURE [dbo].[F_CatalogoUsuarios]
	@pBandera VARCHAR (30) = NULL,
	@Nombre VARCHAR (50) = NULL,
	@ApellidoPaterno VARCHAR (50) = NULL,
	@ApellidoMaterno VARCHAR (50) = NULL,
	@Usuario VARCHAR (50) = NULL,
	@Password VARCHAR (100) = NULL,
	@Iniciales VARCHAR (50) = NULL,
	@CorreoElectronico VARCHAR (300) = NULL,
	@IdTipoUsuario INT = 0,
	@IdUsuario INT = 0,
	@Estatus INT = 0,
	@NombreArchivo VARCHAR (50) = NULL,
    @pIdEmpresa int = 0

AS
BEGIN
	IF @pBandera = 'SELECT'
	BEGIN
		SELECT IdUsuario, Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
		Nombre, ApellidoPaterno, ApellidoMaterno,
		Iniciales, 
		u.IdTipoUsuario,                                                    
		CorreoElectronico, 
		u.Estatus, 
		u.ArchivoImagen,
		(SELECT COUNT(*) 
     FROM Oportunidades 
     WHERE IdEjecutivo = u.IdUsuario
		 AND IdEstatusOportunidad = 1) AS NumOportunidades,
		CASE WHEN u.Estatus = 1 THEN 'Activo' ELSE 'Inactivo' END as DesEstatus, 
		tu.Descripcion as TipoUsuario, 
		u.Usuario
		FROM Usuarios u
		JOIN TiposUsuarios tu ON u.IdTipoUsuario = tu.IdTipoUsuario
		WHERE u.IdEmpresa = @pIdEmpresa
		ORDER BY Nombre, ApellidoPaterno, ApellidoMaterno
	END
	IF @pBandera = 'SEL-REPETIDOS-INSERT'
	BEGIN
		SELECT CorreoElectronico, Estatus, Usuario
		FROM Usuarios 
	END

	IF @pBandera = 'SEL-REPETIDOS'
	BEGIN
		SELECT CorreoElectronico, Estatus, Usuario
		FROM Usuarios 
		WHERE IdUsuario != @IdUsuario --AND IdEmpresa = @pIdEmpresa
	END
	
	IF @pBandera = 'SEL-USUARIOS-ACTIVOS'
	BEGIN
		SELECT IdUsuario, Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
		Nombre, ApellidoPaterno, ApellidoMaterno,
		Iniciales, 
		u.IdTipoUsuario,                                                    
		CorreoElectronico, 
		u.Estatus,  
		tu.Descripcion as TipoUsuario, 
		u.Usuario
		FROM Usuarios u
		JOIN TiposUsuarios tu ON u.IdTipoUsuario = tu.IdTipoUsuario
		WHERE u.IdEmpresa = @pIdEmpresa 
			AND u.Estatus = 1
		ORDER BY Nombre, ApellidoPaterno, ApellidoMaterno
	END
	
	IF @pBandera = 'SEL-AGENTE-CLIENTES'
	BEGIN
		DECLARE @Tabla table (Nombre varchar(50), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ColorNormalizado varchar(10))
		INSERT INTO @Tabla SELECT DISTINCT 
			p.Nombre,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-CLIENTE', p.IdProspecto, @IdUsuario),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-CLIENTE', p.IdProspecto, @IdUsuario),0) as MontoNormalizado,
			'#b94d0a' as ColorNormalizado
		FROM Prospectos p
		LEFT JOIN Oportunidades o on o.IdProspecto = p.IdProspecto
		LEFT JOIN Usuarios u ON o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEjecutivo = @IdUsuario

		select * from @Tabla WHERE TotalAgente != 0 order by TotalAgente desc
	END

	IF @pBandera = 'SEL-AGENTES'
	BEGIN

	    DECLARE @Tabla2 table (IdUsuario int, NombreCompleto varchar(100), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ArchivoImagen varchar(50))
		INSERT INTO @Tabla2 SELECT DISTINCT 
			IdUsuario, 
			Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE', IdUsuario, 0),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE', IdUsuario, 0),0) as MontoNormalizado,
			CASE WHEN u.ArchivoImagen IS NULL THEN 'persona_icono_principal.png' ELSE u.ArchivoImagen END as ArchivoImagen
		FROM Usuarios u
		LEFT JOIN Oportunidades o on o.IdEjecutivo = u.IdUsuario 
		WHERE u.IdEmpresa = @pIdEmpresa
		

		select * from @Tabla2 WHERE TotalAgente != 0
	END

	IF @pBandera = 'SEL-AGENTE-TIPO'
	BEGIN
		DECLARE @vMontoTotal DECIMAL (16,2)
		SET @vMontoTotal = (select SUM(Monto) from Oportunidades WHERE IdEjecutivo = @IdUsuario and IdEstatusOportunidad =1 and IdEmpresa = @pIdEmpresa)

		DECLARE @Tabla3 table (Descripcion varchar(50), Monto decimal(16,2), MontoNormalizado decimal(16,2), Porcentaje decimal(6,2))
		INSERT INTO @Tabla3
			SELECT distinct tp.Descripcion, ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO', @IdUsuario, tp.IdTipoProyecto), 0) as Monto,
					ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-TIPO', @IdUsuario, o.IdTipoProyecto),0) as MontoNormalizado,
					CAST(ROUND(((ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO', @IdUsuario, tp.IdTipoProyecto), 0) * 100)/@vMontoTotal),2) as Decimal(5,2)) as Porcentaje
			FROM TiposOportunidad tp
			LEFT JOIN Oportunidades o ON o.IdTipoProyecto = tp.IdTipoProyecto 
			WHERE o.IdEjecutivo = @IdUsuario and o.IdEmpresa = @pIdEmpresa

		select * from @Tabla3 WHERE Monto != 0 order by Monto desc
	END

		IF @pBandera = 'SEL-AGENTE-SECTOR-PERSONAL'
	BEGIN
	WITH ConteoSector AS (
    SELECT
	    s.IdSector,
        s.NombreSector,
        SUM(o.Monto) AS Monto,
		SUM((o.Monto*o.Probabilidad)/100) as MontoNormalizado
    FROM
        Oportunidades o
    JOIN
        Prospectos p ON p.IdProspecto = o.IdProspecto
    JOIN
        Sectores s ON p.IdSector = s.IdSector
    WHERE
            o.IdEjecutivo = @IdUsuario
        AND o.IdEstatusOportunidad = 1
        AND o.IdEmpresa = @pIdEmpresa
    GROUP BY
        s.IdSector, s.NombreSector
)

SELECT
    cs.IdSector,
    cs.NombreSector as Descripcion,
    cs.Monto as Monto,
	cs.MontoNormalizado,
    ROUND((cs.Monto * 100.0 / SUM(cs.Monto) OVER ()), 2) AS Porcentaje
FROM
    ConteoSector cs
ORDER BY cs.Monto desc;

	END

		IF @pBandera = 'SEL-AGENTE-SECTOR'
	BEGIN
	WITH ConteoSector AS (
    SELECT
		s.IdSector,
        s.NombreSector,
        SUM(o.Monto) AS Monto,
		SUM((o.Monto*o.Probabilidad)/100) as MontoNormalizado
    FROM
        Oportunidades o
    JOIN
        Prospectos p ON p.IdProspecto = o.IdProspecto
    JOIN
        Sectores s ON p.IdSector = s.IdSector
    WHERE
        --o.IdEjecutivo = @IdUsuario--se comenta este where pues ahora el ing quiere general la grafica
        o.IdEstatusOportunidad = 1
        AND o.IdEmpresa = @pIdEmpresa
    GROUP BY
        s.NombreSector, s.IdSector
)

SELECT
	cs.IdSector,
    cs.NombreSector as Descripcion,
    cs.Monto as Monto,
	cs.MontoNormalizado,
    ROUND((cs.Monto * 100.0 / SUM(cs.Monto) OVER ()), 2) AS Porcentaje
FROM
    ConteoSector cs
ORDER BY cs.Monto desc;

	END



	IF @pBandera = 'SEL-ENPROCESO'
	BEGIN
		SELECT IdOportunidad, p.Nombre as Cliente, NombreOportunidad, Monto, o.IdEjecutivo AS IdEjecutivo
		FROM Oportunidades o
		LEFT JOIN Prospectos p ON o.IdProspecto = p.IdProspecto
		WHERE IdEjecutivo = @IdUsuario and IdEstatusOportunidad = 1 AND o.IdEmpresa = @pIdEmpresa
	END


	IF @pBandera = 'INSERT'
	BEGIN
		INSERT INTO Usuarios (Nombre, ApellidoPaterno, ApellidoMaterno, Usuario, Password, Iniciales, CorreoElectronico, IdTipoUsuario, Estatus, FechaRegistro, IdEmpresa,UsuarioCreador,FechaModificacion) VALUES
							 (@Nombre, @ApellidoPaterno, @ApellidoMaterno, @Usuario, @Password, @Iniciales, @CorreoElectronico, @IdTipoUsuario, 1, GETDATE(), @pIdEmpresa,@IdUsuario,GETDATE())
		SELECT SCOPE_IDENTITY() AS IdUsuario;

	END

	IF @pBandera = 'UPDATE'
	BEGIN
		UPDATE Usuarios 
		SET Nombre = CASE WHEN @Nombre IS NULL THEN Nombre ELSE @Nombre END, 
		ApellidoPaterno = CASE WHEN @ApellidoPaterno IS NULL THEN ApellidoPaterno ELSE @ApellidoPaterno END, 
		ApellidoMaterno =  CASE WHEN @ApellidoMaterno IS NULL THEN ApellidoMaterno ELSE @ApellidoMaterno END, 
		Iniciales = CASE WHEN @Iniciales IS NULL THEN Iniciales ELSE @Iniciales END,
		Usuario = CASE WHEN @Usuario IS NULL THEN Usuario ELSE @Usuario END,
		FechaModificacion=GetDate(),
		CorreoElectronico = CASE WHEN @CorreoElectronico IS NULL THEN CorreoElectronico ELSE @CorreoElectronico END, 
		Password = CASE WHEN @Password IS NULL THEN Password ELSE @Password END, 
		IdTipoUsuario = CASE WHEN @IdTipoUsuario = 0 THEN IdTipoUsuario ELSE @IdTipoUsuario END, 
		Estatus = @Estatus WHERE IdUsuario = @IdUsuario
		
	END

	IF @pBandera = 'USUARIO-BY-USERNAME'
	BEGIN
		IF EXISTS( SELECT IdUsuario FROM Usuarios WHERE Usuario = @Usuario AND Estatus = 1)
			begin
				select distinct  IdUsuario, Usuario, CorreoElectronico, Password
				FROM Usuarios 
				WHERE Usuario = @Usuario 
		END		
		
	END
	

	IF @pBandera = 'SEL-AGENTE-CLIENTES-GANADAS'
	BEGIN
		DECLARE @Tabla4 table (Nombre varchar(50), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ColorNormalizado varchar(10))
		INSERT INTO @Tabla4 SELECT DISTINCT 
			p.Nombre,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-CLIENTE-GANADAS', p.IdProspecto, @IdUsuario),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-CLIENTE-GANADAS', p.IdProspecto, @IdUsuario),0) as MontoNormalizado,
			'#b94d0a' as ColorNormalizado
		FROM Prospectos p
		LEFT JOIN Oportunidades o on o.IdProspecto = p.IdProspecto
		LEFT JOIN Usuarios u ON o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 2

		select * from @Tabla4 WHERE TotalAgente != 0 order by TotalAgente desc
	END

	IF @pBandera = 'SEL-AGENTE-CLIENTES-ELIMINADAS'
	BEGIN
		DECLARE @Tabla9 table (Nombre varchar(50), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ColorNormalizado varchar(10))
		INSERT INTO @Tabla9 SELECT DISTINCT 
			p.Nombre,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-CLIENTE-ELIMINADAS', p.IdProspecto, @IdUsuario),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-CLIENTE-ELIMINADAS', p.IdProspecto, @IdUsuario),0) as MontoNormalizado,
			'#b94d0a' as ColorNormalizado
		FROM Prospectos p
		LEFT JOIN Oportunidades o on o.IdProspecto = p.IdProspecto
		LEFT JOIN Usuarios u ON o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 5

		select * from @Tabla9 WHERE TotalAgente != 0 order by TotalAgente desc
	END
	
	
	IF @pBandera = 'SEL-AGENTE-CLIENTES-CANCELADAS'
	BEGIN
		DECLARE @Tabla12 table (Nombre varchar(50), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ColorNormalizado varchar(10))
		INSERT INTO @Tabla12 SELECT DISTINCT 
			p.Nombre,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-CLIENTE-CANCELADAS', p.IdProspecto, @IdUsuario),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-CLIENTE-CANCELADAS', p.IdProspecto, @IdUsuario),0) as MontoNormalizado,
			'#b94d0a' as ColorNormalizado
		FROM Prospectos p
		LEFT JOIN Oportunidades o on o.IdProspecto = p.IdProspecto
		LEFT JOIN Usuarios u ON o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 4

		select * from @Tabla12 WHERE TotalAgente != 0 order by TotalAgente desc
	END
	
	
	IF @pBandera = 'SEL-AGENTES-GANADAS'
	BEGIN

	    DECLARE @Tabla5 table (IdUsuario int, NombreCompleto varchar(100), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ArchivoImagen varchar(50))
		INSERT INTO @Tabla5 SELECT DISTINCT 
			IdUsuario, 
			Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-GANADAS', IdUsuario, @pIdEmpresa),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-GANADAS', IdUsuario, @pIdEmpresa),0) as MontoNormalizado,
			CASE WHEN u.ArchivoImagen IS NULL THEN 'persona_icono_principal.png' ELSE u.ArchivoImagen END as ArchivoImagen
		FROM Usuarios u
		LEFT JOIN Oportunidades o on o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEstatusOportunidad = 2  AND o.IdEmpresa = @pIdEmpresa

		select * from @Tabla5 WHERE TotalAgente != 0
	END

	
	IF @pBandera = 'SEL-AGENTE-TIPO-GANADAS'
	BEGIN
		DECLARE @vMontoTotalA DECIMAL (16,2)
		SET @vMontoTotalA = (select SUM(Monto) from Oportunidades WHERE IdEjecutivo = @IdUsuario and IdEstatusOportunidad = 2)

		DECLARE @Tabla6 table (Descripcion varchar(50), Monto decimal(16,2), MontoNormalizado decimal(16,2), Porcentaje decimal(6,2))
		INSERT INTO @Tabla6
			SELECT distinct tp.Descripcion, ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-GANADAS', @IdUsuario, tp.IdTipoProyecto), 0) as Monto,
					ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-TIPO-GANADAS', @IdUsuario, o.IdTipoProyecto),0) as MontoNormalizado,
					CAST(ROUND(((ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-GANADAS', @IdUsuario, tp.IdTipoProyecto), 0) * 100)/@vMontoTotalA),2) as Decimal(5,2)) as Porcentaje
			FROM TiposOportunidad tp
			LEFT JOIN Oportunidades o ON o.IdTipoProyecto = tp.IdTipoProyecto 
			WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 2

		select * from @Tabla6 WHERE Monto != 0 order by Monto desc
	END

	IF @pBandera = 'SEL-AGENTE-TIPO-ELIMINADAS'
	BEGIN
		DECLARE @vMontoTotalAE DECIMAL (16,2)
		SET @vMontoTotalAE = (select SUM(Monto) from Oportunidades WHERE IdEjecutivo = @IdUsuario and IdEstatusOportunidad = 5)

		DECLARE @Tabla8 table (Descripcion varchar(50), Monto decimal(16,2), MontoNormalizado decimal(16,2), Porcentaje decimal(6,2))
		INSERT INTO @Tabla8
			SELECT distinct tp.Descripcion, ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-ELIMINADAS', @IdUsuario, tp.IdTipoProyecto), 0) as Monto,
					ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-TIPO-ELIMINADAS', @IdUsuario, o.IdTipoProyecto),0) as MontoNormalizado,
					CAST(ROUND(((ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-ELIMINADAS', @IdUsuario, tp.IdTipoProyecto), 0) * 100)/@vMontoTotalAE),2) as Decimal(5,2)) as Porcentaje
			FROM TiposOportunidad tp
			LEFT JOIN Oportunidades o ON o.IdTipoProyecto = tp.IdTipoProyecto 
			WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 5

		select * from @Tabla8 WHERE Monto != 0 order by Monto desc
	END

	IF @pBandera = 'SEL-AGENTE-TIPO-CANCELADAS'
	BEGIN
		DECLARE @vMontoTotalAC DECIMAL (16,2)
		SET @vMontoTotalAC = (select SUM(Monto) from Oportunidades WHERE IdEjecutivo = @IdUsuario and IdEstatusOportunidad = 4)

		DECLARE @Tabla11 table (Descripcion varchar(50), Monto decimal(16,2), MontoNormalizado decimal(16,2), Porcentaje decimal(6,2))
		INSERT INTO @Tabla11
			SELECT distinct tp.Descripcion, ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-CANCELADAS', @IdUsuario, tp.IdTipoProyecto), 0) as Monto,
					ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-TIPO-CANCELADAS', @IdUsuario, o.IdTipoProyecto),0) as MontoNormalizado,
					CAST(ROUND(((ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-TIPO-CANCELADAS', @IdUsuario, tp.IdTipoProyecto), 0) * 100)/@vMontoTotalAC),2) as Decimal(5,2)) as Porcentaje
			FROM TiposOportunidad tp
			LEFT JOIN Oportunidades o ON o.IdTipoProyecto = tp.IdTipoProyecto 
			WHERE o.IdEjecutivo = @IdUsuario and o.IdEstatusOportunidad = 4

		select * from @Tabla11 WHERE Monto != 0 order by Monto desc
	END
	
	IF @pBandera = 'SEL-AGENTES-ELIMINADAS'
	BEGIN

	    DECLARE @Tabla7 table (IdUsuario int, NombreCompleto varchar(100), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ArchivoImagen varchar(50))
		INSERT INTO @Tabla7 SELECT DISTINCT 
			IdUsuario, 
			Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-ELIMINADAS', IdUsuario, @pIdEmpresa),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-ELIMINADAS', IdUsuario, @pIdEmpresa),0) as MontoNormalizado,
			CASE WHEN u.ArchivoImagen IS NULL THEN 'persona_icono_principal.png' ELSE u.ArchivoImagen END as ArchivoImagen
		FROM Usuarios u
		LEFT JOIN Oportunidades o on o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEstatusOportunidad = 5  AND o.IdEmpresa = @pIdEmpresa

		select * from @Tabla7 WHERE TotalAgente != 0
	END
	
	IF @pBandera = 'SEL-AGENTES-CANCELADAS'
	BEGIN

	    DECLARE @Tabla10 table (IdUsuario int, NombreCompleto varchar(100), TotalAgente decimal(16,2), MontoNormalizado decimal(16,2), ArchivoImagen varchar(50))
		INSERT INTO @Tabla10 SELECT DISTINCT 
			IdUsuario, 
			Nombre + ' ' + ApellidoPaterno + ' ' + ApellidoMaterno AS NombreCompleto,
			ISNULL(dbo.F_ConsultaMontos('MONTO-AGENTE-CANCELADAS', IdUsuario, @pIdEmpresa),0) as TotalAgente,
			ISNULL(dbo.F_ConsultaMontos('MONTO-NORM-AGENTE-CANCELADAS', IdUsuario, @pIdEmpresa),0) as MontoNormalizado,
			CASE WHEN u.ArchivoImagen IS NULL THEN 'persona_icono_principal.png' ELSE u.ArchivoImagen END as ArchivoImagen
		FROM Usuarios u
		LEFT JOIN Oportunidades o on o.IdEjecutivo = u.IdUsuario
		WHERE o.IdEstatusOportunidad = 4  AND o.IdEmpresa = @pIdEmpresa

		select * from @Tabla10 WHERE TotalAgente != 0
	END

	IF @pBandera = 'SEL-TIPOUSUARIO'
	BEGIN
		SELECT IdTipoUsuario, Descripcion FROM TiposUsuarios 
	END

	IF @pBandera = 'UPDATE-ESTATUS'
	BEGIN
		UPDATE Usuarios 
		SET 
		Estatus = @Estatus,
		FechaModificacion=GetDate()
		WHERE IdUsuario = @IdUsuario
	END
		
	IF @pBandera = 'UPDATE-FOTO'
	BEGIN
		IF @NombreArchivo IS NULL OR @NombreArchivo = ''
		BEGIN
			UPDATE Usuarios 
			SET 
			ArchivoImagen = '',
			FechaModificacion=GetDate()
			WHERE IdUsuario = @IdUsuario
		END
		ELSE
		BEGIN
			UPDATE Usuarios 
			SET 
			ArchivoImagen = @NombreArchivo,
			FechaModificacion=GetDate()
			WHERE IdUsuario = @IdUsuario
		END
	END

	IF @pBandera = 'SELECT-FOTO'
	BEGIN
		SELECT ArchivoImagen AS NombreImg FROM Usuarios WHERE Usuario = @Usuario
	END

	IF @pBandera = 'UPDATE-PASS'
	BEGIN
		UPDATE Usuarios 
		SET FechaModificacion=GetDate(), 
		Password = CASE WHEN @Password IS NULL THEN Password ELSE @Password END
		WHERE IdUsuario = @IdUsuario
		
	END
END