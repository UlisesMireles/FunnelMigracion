USE [SFS-MASTER-QA]
GO

INSERT INTO [dbo].[ConfiguracionColumnas]
           ([Llave]
           ,[Valor]
           ,[TipoFormato]
           ,[FechaRegistro]
           ,[FechaModificacion])
     VALUES
           ('nombreCompleto'
           ,'Nombre'
           ,'text'
           ,GETDATE()
           ,NULL)
GO

UPDATE [dbo].[ConfiguracionColumnasDefault]
   SET 
      [IsChecked] = 0
      ,[IsIgnore] = 1
 WHERE IdTabla = 9 AND IdColumna = 44
GO

INSERT INTO [dbo].[ConfiguracionColumnasDefault]
           ([IdTabla]
           ,[IdColumna]
           ,[IsChecked]
           ,[IsIgnore]
           ,[IsTotal]
           ,[GroupColumn]
           ,[Orden]
           ,[FechaRegistro]
           ,[FechaModificacion])
     VALUES
           (9
           ,63
           ,1
           ,0
           ,1
           ,0
           ,1
           ,GETDATE()
           ,NULL)
GO

UPDATE [dbo].[RelacionConfiguracionColumnasUsuario]
   SET 
      [IsChecked] = 0
      ,[IsIgnore] = 1
 WHERE IdTabla = 9 AND IdColumna = 44
GO

INSERT INTO [dbo].[RelacionConfiguracionColumnasUsuario]
           ([IdTabla]
           ,[IdColumna]
           ,[IdUsuario]
           ,[IsChecked]
           ,[IsIgnore]
           ,[IsTotal]
           ,[GroupColumn]
           ,[Orden]
           ,[FechaRegistro]
           ,[FechaModificacion])
     VALUES
           (9
           ,63
           ,1053
           ,1
           ,0
           ,1
           ,0
           ,1
           ,GETDATE()
           ,NULL)
GO
