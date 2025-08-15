
UPDATE [dbo].[Categorias]
SET [Descripcion] = 'Empezar & Alcance',
    [FechaModificacion] = GETDATE()  
WHERE [IdCategoria] = 14;
GO
ALTER TABLE [dbo].[Categorias]
ALTER COLUMN Descripcion VARCHAR(35); 

INSERT INTO [dbo].[Categorias] 
       ([Descripcion]
       ,[MensajePrincipalCategoria]
       ,[MensajePrincipal]
       ,[Activo]
       ,[FechaCreacion]
       ,[FechaModificacion]
       ,[LimitePreguntas]
       ,[IdBot])
VALUES
('Personalización & Tono', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Casos por Sector & Prueba Social', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Objeciones & Entrenamiento', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Prospección, CRM & Acciones', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Costos, Rendimiento & Métricas', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Privacidad, Idiomas & Compliance', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7),
('Soporte & Escalamiento', NULL, NULL, 1, GETDATE(), GETDATE(), 30, 7);
