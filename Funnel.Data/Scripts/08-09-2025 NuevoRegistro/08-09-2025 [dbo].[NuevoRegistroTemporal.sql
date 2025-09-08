USE [SFS-MASTER-QA]
GO

/****** Object:  Table [dbo].[Empresas]    Script Date: 08/09/2025 10:35:36 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NuevoRegistroTemporal](
	[IdRegistro] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](100) NULL,
	[Correo] [varchar](200) NULL,
	[Usuario] [varchar](20) NULL,
	[RFC] [varchar](20) NULL,
	[NombreEmpresa] [varchar](200) NULL, 
	[Direccion] [nvarchar](50) NULL,
	[UrlSitio] [varchar](500) NULL,
	[TamanoEmpresa] [varchar](50) NULL
PRIMARY KEY CLUSTERED 
(
	[IdRegistro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

