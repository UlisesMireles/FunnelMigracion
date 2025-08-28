
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
		   (72,'Obtener ideas o ejemplos de comunicación comercial',GETDATE(),NULL,1,1),
		   (72,'Refinar mi pitch de ventas',GETDATE(),NULL,1,1),
		   (72,'Explorar soluciones de IA para distintos sectores',GETDATE(),NULL,1,1),
		   (72,'Otro (especificar en comentarios)',GETDATE(),NULL,1,1),
           (73,'Muy fácil',GETDATE(),NULL,1,1),
		   (73,'Algo fácil',GETDATE(),NULL,1,1),
		   (73,'Ni fácil ni difícil',GETDATE(),NULL,1,1),
		   (73,'Algo difícil',GETDATE(),NULL,1,1),
		   (73,'Muy difícil',GETDATE(),NULL,1,1)
GO


