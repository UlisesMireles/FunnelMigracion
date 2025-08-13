USE [SFS-MASTER-QA]
GO

/****** Object:  Table [dbo].[RespuestasEncuesta]    Script Date: 08/08/2025 11:30:42 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RespuestasEncuesta](
	[IdRespuesta] [int] IDENTITY(1,1) NOT NULL,
	[IdPregunta] [int] NOT NULL,
	[Respuesta] [varchar](max) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[FechaModificacion] [datetime] NULL,
	[Activo] [bit] NOT NULL,
	[Estatus] [bit] NOT NULL,
 CONSTRAINT [PK_RespuestasEncuesta] PRIMARY KEY CLUSTERED 
(
	[IdRespuesta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[RespuestasEncuesta]  WITH CHECK ADD  CONSTRAINT [FK_RespuestasEncuesta_PreguntasFrecuentes] FOREIGN KEY([IdPregunta])
REFERENCES [dbo].[PreguntasFrecuentes] ([Id])
GO

ALTER TABLE [dbo].[RespuestasEncuesta] CHECK CONSTRAINT [FK_RespuestasEncuesta_PreguntasFrecuentes]
GO


