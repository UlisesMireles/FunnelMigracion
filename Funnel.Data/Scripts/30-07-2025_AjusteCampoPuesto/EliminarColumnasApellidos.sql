USE [SFS-MASTER-QA]
GO

DELETE FROM [dbo].[ConfiguracionColumnasDefault]
      WHERE IdTabla = 9 AND IdColumna = 45 
GO

DELETE FROM [dbo].[ConfiguracionColumnasDefault]
      WHERE IdTabla = 9 AND IdColumna = 46
GO


DELETE FROM [dbo].[RelacionConfiguracionColumnasUsuario]
      WHERE IdTabla = 9 AND IdColumna = 45
GO


DELETE FROM [dbo].[RelacionConfiguracionColumnasUsuario]
      WHERE IdTabla = 9 AND IdColumna = 46
GO

