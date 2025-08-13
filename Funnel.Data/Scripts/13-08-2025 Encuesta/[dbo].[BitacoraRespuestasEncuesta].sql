USE [SFS-MASTER-QA]
GO

/****** Object:  Table [dbo].[BitacoraRespuestasEncuesta]    Script Date: 08/08/2025 11:31:37 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[BitacoraRespuestasEncuesta](
	[IdBitacoraRespuesta] [int] IDENTITY(1,1) NOT NULL,
	[IdBot] [int] NOT NULL,
	[Pregunta] [varchar](255) NOT NULL,
	[FechaPregunta] [datetime] NOT NULL,
	[Respuesta] [varchar](max) NOT NULL,
	[FechaRespuesta] [datetime] NOT NULL,
	[Respondio] [bit] NOT NULL,
	[TokensEntrada] [int] NOT NULL,
	[TokensSalida] [int] NOT NULL,
	[IdUsuario] [int] NOT NULL,
	[CostoPregunta] [decimal](18, 8) NOT NULL,
	[CostoRespuesta] [decimal](18, 8) NOT NULL,
	[CostoTotal] [decimal](18, 8) NOT NULL,
	[Modelo] [varchar](30) NOT NULL,
 CONSTRAINT [PK_BitacoraRespuestasEncuesta] PRIMARY KEY CLUSTERED 
(
	[IdBitacoraRespuesta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[BitacoraRespuestasEncuesta]  WITH CHECK ADD  CONSTRAINT [FK_BitacoraRespuestasEncuesta_Asistentes] FOREIGN KEY([IdBot])
REFERENCES [dbo].[Asistentes] ([IdBot])
GO

ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] CHECK CONSTRAINT [FK_BitacoraRespuestasEncuesta_Asistentes]
GO

ALTER TABLE [dbo].[BitacoraRespuestasEncuesta]  WITH CHECK ADD  CONSTRAINT [FK_BitacoraRespuestasEncuesta_ModelosOpenIA] FOREIGN KEY([Modelo])
REFERENCES [dbo].[ModelosOpenIA] ([Modelo])
GO

ALTER TABLE [dbo].[BitacoraRespuestasEncuesta] CHECK CONSTRAINT [FK_BitacoraRespuestasEncuesta_ModelosOpenIA]
GO


