USE [SFS-MASTER-QA]
GO

/****** Object:  Table [dbo].[[PreguntasEncuesta]]    Script Date: 14/08/2025 05:07:00 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PreguntasEncuesta](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdBot] [int] NOT NULL,
	[Pregunta] [varchar](255) NOT NULL,
	[Respuesta] [varchar](max) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[FechaModificacion] [datetime] NULL,
	[Activo] [bit] NOT NULL,
	[Estatus] [bit] NOT NULL,
 CONSTRAINT [PK_PreguntasEncuesta] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[PreguntasEncuesta]  WITH CHECK ADD  CONSTRAINT [FK_PreguntasEncuesta_Asistentes] FOREIGN KEY([IdBot])
REFERENCES [dbo].[Asistentes] ([IdBot])
GO

ALTER TABLE [dbo].[PreguntasEncuesta] CHECK CONSTRAINT [FK_PreguntasEncuesta_Asistentes]
GO

INSERT INTO [dbo].[PreguntasEncuesta]
           ([IdBot]
           ,[Pregunta]
           ,[Respuesta]
           ,[FechaCreacion]
           ,[FechaModificacion]
           ,[Activo]
           ,[Estatus])
     VALUES
           (7
           ,'¿Para qué utilizaste a Bruno en esta ocasión?'
           ,'<p>Multiple</p>'
           ,GETDATE()
           ,NULL
           ,1
           ,1),
		    (7
           ,'¿Qué tan fácil fue interactuar con Bruno?'
           ,'<p>Multiple</p>'
           ,GETDATE()
           ,NULL
           ,1
           ,1),
		    (7
           ,'En una escala del 1 al 5, ¿qué tan útil fue la respuesta de Bruno para lo que necesitabas? 

(1 = Nada útil, 5 = Muy útil) '
           ,'<p>Opciones</p>'
           ,GETDATE()
           ,NULL
           ,1
           ,1),
		    (7
           ,'En una escala del 1 al 5, ¿cómo calificarías el tono y la claridad con la que Bruno se comunica? 

(1 = Poco claro o poco profesional, 5 = Muy claro y profesional)   '
           ,'<p>Opciones</p>'
           ,GETDATE()
           ,NULL
           ,1
           ,1),
		    (7
           ,'¿Hay algo que te gustaría que Bruno hiciera diferente o mejor?  '
           ,'<p>Abierta</p>'
           ,GETDATE()
           ,NULL
           ,1
           ,1)
GO

UPDATE [dbo].[RespuestasEncuesta]
   SET [IdPregunta] = 1
 WHERE IdPregunta = 72
GO

UPDATE [dbo].[RespuestasEncuesta]
   SET [IdPregunta] = 2
 WHERE IdPregunta = 73
GO