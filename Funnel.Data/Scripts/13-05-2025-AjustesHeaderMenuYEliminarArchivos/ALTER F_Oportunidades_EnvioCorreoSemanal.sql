USE [SFS-QA-TENANT]
GO
/****** Object:  StoredProcedure [dbo].[F_Oportunidades_EnvioCorreoSemanal]    Script Date: 12/05/2025 04:50:18 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ulises Mireles Cruz
-- Create date: 2021-04-19
-- Description:	Consultas de empresas de Tenant
-- =============================================
ALTER PROCEDURE [dbo].[F_Oportunidades_EnvioCorreoSemanal] 
  @pIdEmpresa int = 0,
  @pIdReporte int = 1,
  @pCorreos VARCHAR(MAX) = NULL
AS
BEGIN
	DECLARE @Enviar BIT = 1;
	DECLARE @Empresa VARCHAR(200) = (Select NombreEmpresa FROM Empresas WHEre IdEmpresa = @pIdEmpresa );
	DECLARE @Asunto VARCHAR(500) = CASE WHEN  @pIdReporte = 1 THEN 'Reporte semanal de seguimiento de oportunidades' WHEN @pIdReporte = 2 THEN 'Reporte diario de seguimiento de oportunidades' END
	DECLARE @Tabla TABLE(IdOportunidad INT, NombreOportunidad VARCHAR(250), Cliente VARCHAR(250), Monto DECIMAL (20,2), Ejecutivo VARCHAR(250), Comentario VARCHAR(MAX), FechaRegistro DATETIME)

	DECLARE @Body VARCHAR(MAX) = '<h2>' + @Empresa + '</h2>';
	IF @pIdReporte = 1
	BEGIN
	 SET @Body = @Body +  '<h3>Reporte de seguimiento del ' + 
				convert(varchar(25), DATEADD(DAY, -6, GETDATE()), 103) + 
				' al ' 
				+ convert(varchar(25), GETDATE(), 103) +'</h3><br/>'
				+ '<div>';
	END
	ELSE IF  @pIdReporte = 2
	BEGIN 
		SET @Body = @Body +  '<h3>Reporte de seguimiento del ' + 
				+ convert(varchar(25), GETDATE(), 103) +'</h3><br/>'
				+ '<div>';
	END
	INSERT INTO @Tabla (IdOportunidad, NombreOportunidad, Cliente, Monto, Ejecutivo, Comentario, FechaRegistro)
	SELECT 
			O.IdOportunidad,
			O.NombreOportunidad,
			P.Nombre,
			O.Monto,
			U.Nombre + ' ' + U.ApellidoPaterno + ' ' + U.ApellidoMaterno,
			H.Comentario,
			H.FechaRegistro AS FechaRegistro
		FROM Oportunidades O
			LEFT JOIN Prospectos P ON P.IdProspecto = O.IdProspecto
			LEFT JOIN HistoricoOportunidades H ON H.IdOportunidad = O.IdOportunidad
			LEFT JOIN Usuarios U  ON U.IdUsuario = H.IdUsuario
		WHERE 
			O.IdEmpresa = @pIdEmpresa
		AND (O.FechaRegistro BETWEEN CASE WHEN @pIdReporte = 1 THEN DATEADD(DAY, -6, GETDATE()) WHEN @pIdReporte = 2 THEN DATEADD(DAY, -1, GETDATE()) END AND GETDATE()  OR
			H.FechaRegistro BETWEEN  CASE WHEN @pIdReporte = 1 THEN DATEADD(DAY, -6, GETDATE()) WHEN @pIdReporte = 2 THEN DATEADD(DAY, -1, GETDATE()) END AND GETDATE())
		AND
			o.IdStage IN (
				CASE 
					WHEN @pIdReporte = 1 THEN 2
					ELSE 4
				END,
				CASE 
					WHEN @pIdReporte = 1 THEN 3
					ELSE 5
				END,
				4, 5, 6
			)
		ORDER BY H.FechaRegistro DESC;

	WHILE (select count(*)from @Tabla) > 0
	BEGIN
		DECLARE @IdOportunidad INT = (SELECT TOP 1 IdOportunidad FROM @Tabla);
		SET @Body = @Body + '<label style="font-size: 16px;"><b>' + (SELECT DISTINCT Cliente from @Tabla WHERE IdOportunidad = @IdOportunidad) +'</b></label><br/>'
						  + '<label style="font-size: 16px;">' + (SELECT DISTINCT  NombreOportunidad from @Tabla WHERE IdOportunidad = @IdOportunidad) +'</label><br/>'
						  + '<label style="font-size: 16px;font-weight: 700;">Comentarios:</label><ul>';
		;WITH Comentarios AS 
		(
			SELECT Comentario, Ejecutivo, FechaRegistro from @Tabla WHERE IdOportunidad = @IdOportunidad
		)
		SELECT @Body = @Body + '<li>' +convert(varchar(25), FechaRegistro, 103)  + ' | ' +  + Ejecutivo + ' | ' +  Comentario + '</li>' FROM Comentarios order by FechaRegistro DESC;
		SET @Body = @Body + '</ul>';
		DELETE FROM @Tabla WHERE IdOportunidad = @IdOportunidad;
	END

	IF (SELECT COUNT(O.IdOportunidad)
			FROM Oportunidades O
				LEFT JOIN Prospectos P ON P.IdProspecto = O.IdProspecto
				LEFT JOIN Usuarios U  ON u.IdUsuario = O.IdEjecutivo
				LEFT JOIN HistoricoOportunidades H ON H.IdOportunidad = O.IdOportunidad
			WHERE 
				O.IdEmpresa = @pIdEmpresa
			AND (O.FechaRegistro BETWEEN  CASE WHEN @pIdReporte = 1 THEN DATEADD(DAY, -6, GETDATE()) WHEN @pIdReporte = 2 THEN DATEADD(DAY, -1, GETDATE()) END  AND GETDATE()  OR
				H.FechaRegistro BETWEEN CASE WHEN @pIdReporte = 1 THEN DATEADD(DAY, -6, GETDATE()) WHEN @pIdReporte = 2 THEN DATEADD(DAY, -1, GETDATE()) END  AND GETDATE())) = 0
	BEGIN
		SET @Body = @Body + '<label style="font-size: 16px;">No hay información disponible</label>';
		SET @Enviar = 0;
	END

	SET @Body = @Body + '</div><br /><br />'
		+ '<h4>Para ver más detalle visita el sitio <a href="'+ (select Descripcion FROM Parametros WHERE ClaveParametro = 'URLFUNNEL') +'">Funnel</a></h4>';
	
	
		if(@pIdReporte = 1)
		BEGIN
			DECLARE @correos VARCHAR(MAX) = ISNULL(@pCorreos, '');
			IF @correos IS NULL OR @correos = ''
			BEGIN
				SET @correos = 'isanchez@eisei.net.mx'; --(SELECT  STRING_AGG(CorreoElectronico, ';') FROM Usuarios WHERE IdEmpresa = @pIdEmpresa AND IdTipoUsuario IN(1,2));
			END
			IF @Enviar = 1
				EXEC msdb.dbo.sp_send_dbmail
				@profile_name='EmailProfile',
				@recipients = @correos,
				@body=@body,
				@subject=@Asunto,
				@body_format = 'HTML';
		END
		ELSE
		BEGIN 
			IF @Enviar = 1
				EXEC msdb.dbo.sp_send_dbmail
				@profile_name='EmailProfile',
				@recipients = @pCorreos,
				@body=@body,
				@subject=@Asunto,
				@body_format = 'HTML';
		END
END
