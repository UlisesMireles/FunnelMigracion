
GO

INSERT INTO [dbo].[RespuestasEncuesta]
           ([IdPregunta]
           ,[Respuesta]
           ,[FechaCreacion]
           ,[FechaModificacion]
           ,[Activo]
           ,[Estatus])
     VALUES
		   (72,'Generar correos o mensajes de primer contacto con clientes',GETDATE(),NULL,1,1),
		   (72,'Obtener ideas o ejemplos de comunicaci�n comercial',GETDATE(),NULL,1,1),
		   (72,'Refinar mi pitch de ventas',GETDATE(),NULL,1,1),
		   (72,'Explorar soluciones de IA para distintos sectores',GETDATE(),NULL,1,1),
		   (72,'Otro (especificar en comentarios)',GETDATE(),NULL,1,1),
           (73,'Muy f�cil',GETDATE(),NULL,1,1),
		   (73,'Algo f�cil',GETDATE(),NULL,1,1),
		   (73,'Ni f�cil ni dif�cil',GETDATE(),NULL,1,1),
		   (73,'Algo dif�cil',GETDATE(),NULL,1,1),
		   (73,'Muy dif�cil',GETDATE(),NULL,1,1)
GO


