-- tabla puestos
CREATE TABLE Puestos (
    Id INT IDENTITY(1,1) PRIMARY KEY,      
    Descripcion VARCHAR(255) NOT NULL,     
    Estatus INT NOT NULL DEFAULT 1,         
    FechaCreacion DATETIME NOT NULL
);

-- registros
INSERT INTO Puestos (Descripcion, Estatus, FechaCreacion)
VALUES
('Administración del Cambio', 1, GETDATE()),
('Administrador de Sistemas', 1, GETDATE()),
('Administrador OS', 1, GETDATE()),
('ADMINISTRADOR RELEASE', 1, GETDATE()),
('Admon de Proyectos', 1, GETDATE()),
('ANALISTA', 1, GETDATE()),
('Analista de Base de Datos', 1, GETDATE()),
('Analista de Gestión de Activos', 1, GETDATE()),
('Analista de Inversiones', 1, GETDATE()),
('Analista de Negocio', 1, GETDATE()),
('Analista de Operaciones', 1, GETDATE()),
('ANALISTA DE ORQUESTACIONES', 1, GETDATE()),
('Analista de Procesos', 1, GETDATE()),
('Analista de Reclutamiento', 1, GETDATE()),
('Analista de Sistemas', 1, GETDATE()),
('Analista de Soluciones de Datos Medio', 1, GETDATE()),
('Analista de soluciones de Negocio', 1, GETDATE()),
('Analista envíos Notificaciones Push', 1, GETDATE()),
('Analista Financiero', 1, GETDATE()),
('Analista Funcional', 1, GETDATE()),
('Analista Jr.', 1, GETDATE()),
('Analista Mailing', 1, GETDATE()),
('ANALISTA MALING', 1, GETDATE()),
('ANALISTA NBA', 1, GETDATE()),
('Analista Sr.', 1, GETDATE()),
('Analista Técnico', 1, GETDATE()),
('APEX', 1, GETDATE()),
('Arquitecto de Software', 1, GETDATE()),
('ARQUITECTO JAVA', 1, GETDATE()),
('Auditor TI', 1, GETDATE()),
('AUTOMATIZACIÓN', 1, GETDATE()),
('Auxiliar de Finanzas', 1, GETDATE()),
('Auxiliar de Limpieza', 1, GETDATE()),
('Auxiliar de Oficina de Calidad', 1, GETDATE()),
('Auxiliar de Recursos Humanos', 1, GETDATE()),
('Auxiliar Oficina de Proyectos', 1, GETDATE()),
('Auxiliar Soporte Técnico', 1, GETDATE()),
('B2B (business to business)', 1, GETDATE()),
('BD Oracle', 1, GETDATE()),
('BI', 1, GETDATE()),
('BPO', 1, GETDATE()),
('Business Hunter', 1, GETDATE()),
('Business Intelligence', 1, GETDATE()),
('CAPTURISTA', 1, GETDATE()),
('Coach TSP', 1, GETDATE()),
('Comercial / Ventas', 1, GETDATE()),
('COMUNICACIÓN/MARKETING', 1, GETDATE()),
('CONSULTOR DE DESARROLLO', 1, GETDATE()),
('Consultor SAP', 1, GETDATE()),
('Consultor SAP FICO', 1, GETDATE()),
('Consultor SOA', 1, GETDATE()),
('Contraloría', 1, GETDATE()),
('Coordinador Administración de Cambios', 1, GETDATE()),
('Coordinador de Finanzas', 1, GETDATE()),
('Coordinador de Oficina de Calidad', 1, GETDATE()),
('Coordinador de Pruebas', 1, GETDATE()),
('Coordinador de Reclutamiento y Selección', 1, GETDATE()),
('Coordinador Oficina de Proyectos', 1, GETDATE()),
('Copy Writer Creativo', 1, GETDATE()),
('COPYWRITER', 1, GETDATE()),
('Data Scientist', 1, GETDATE()),
('Desarrollador', 1, GETDATE()),
('Desarrollador .NET', 1, GETDATE()),
('Desarrollador Ab Initio', 1, GETDATE()),
('Desarrollador Android', 1, GETDATE()),
('Desarrollador ASP3', 1, GETDATE()),
('DESARROLLADOR BACKEND', 1, GETDATE()),
('Desarrollador BPM', 1, GETDATE()),
('Desarrollador Broker/ESB', 1, GETDATE()),
('DESARROLLADOR C#', 1, GETDATE()),
('Desarrollador COBOL', 1, GETDATE()),
('Desarrollador de Sistemas', 1, GETDATE()),
('DESARROLLADOR DE SOFTWARE', 1, GETDATE()),
('Desarrollador ETL', 1, GETDATE()),
('Desarrollador Front End', 1, GETDATE()),
('DESARROLLADOR FULL STACK', 1, GETDATE()),
('Desarrollador iOS', 1, GETDATE()),
('Desarrollador JAVA', 1, GETDATE()),
('DESARROLLADOR JR', 1, GETDATE()),
('DESARROLLADOR MEAN STACK', 1, GETDATE()),
('Desarrollador Message Broker', 1, GETDATE()),
('Desarrollador Microsoft', 1, GETDATE()),
('Desarrollador Móvil (iOS, Android, etc.)', 1, GETDATE()),
('DESARROLLADOR NODE JS', 1, GETDATE()),
('DESARROLLADOR OFFICE 365', 1, GETDATE()),
('Desarrollador OPTIO', 1, GETDATE()),
('Desarrollador Oracle', 1, GETDATE()),
('Desarrollador PL SQL', 1, GETDATE()),
('DESARROLLADOR QLIKVIEW', 1, GETDATE()),
('DESARROLLADOR RPA', 1, GETDATE()),
('Desarrollador SAP NetWeaver', 1, GETDATE()),
('Desarrollador SAS', 1, GETDATE()),
('Desarrollador SQL', 1, GETDATE()),
('Desarrollador Visual Studio', 1, GETDATE()),
('Desarrollador WEB (JAVA Angular/spring)', 1, GETDATE()),
('Desarrollador Web (PHP, Drupal, etc.)', 1, GETDATE()),
('Desarrollador Web Methods', 1, GETDATE()),
('Desarrollador Xamarin', 1, GETDATE()),
('Director Comercial y Nuevos Negocios', 1, GETDATE()),
('Director de Operaciones / Director de Unidad', 1, GETDATE()),
('Director General', 1, GETDATE()),
('Director General Adjunto', 1, GETDATE()),
('Director Operaciones Tecnología Convergente', 1, GETDATE()),
('Diseñador Gráfico', 1, GETDATE()),
('Diseñador UX', 1, GETDATE()),
('Diseñador Web', 1, GETDATE()),
('E-Commerce', 1, GETDATE()),
('Especialista BASE 24', 1, GETDATE()),
('Especialista BPM', 1, GETDATE()),
('Especialista de Arquitectura Tecnológica', 1, GETDATE()),
('Especialista de Integración', 1, GETDATE()),
('Especialista en Excel', 1, GETDATE()),
('Especialista en SCAT', 1, GETDATE()),
('Especialista Financiero', 1, GETDATE()),
('Full Stack Dev Web', 1, GETDATE()),
('Full Stack Mobile Web', 1, GETDATE()),
('GENEXUS', 1, GETDATE()),
('GERENTE ESTRATEGIAS PLANEACIÓN COMERCIAL', 1, GETDATE()),
('Gerente Comercial ATM\"S"', 1, GETDATE()),
('Gerente de Administración, Finanzas y Cultura Organizacional', 1, GETDATE()),
('Gerente de Contenidos', 1, GETDATE()),
('GERENTE DE ORIGINACIÓN Y VENTAS', 1, GETDATE()),
('Gestor de Proyecto', 1, GETDATE()),
('Gestor de Proyectos', 1, GETDATE()),
('Implementador', 1, GETDATE()),
('Ing. de Automatización', 1, GETDATE()),
('ING. DE SOPORTE TECNICO', 1, GETDATE()),
('ING. TELECOMUNICACIONES CISCO', 1, GETDATE()),
('Ingeniero de automatización', 1, GETDATE()),
('Ingeniero de ciberseguridad', 1, GETDATE()),
('Ingeniero de Insumos', 1, GETDATE()),
('Ingeniero de Pruebas', 1, GETDATE()),
('Ingeniero Telecomunicaciones Cisco', 1, GETDATE()),
('IPC', 1, GETDATE()),
('Jefe de Recursos Humanos', 1, GETDATE()),
('KEY ACCOUNT MANAGER', 1, GETDATE()),
('LIDER .NET', 1, GETDATE()),
('Líder de Seguridad', 1, GETDATE()),
('LIDER JAVA', 1, GETDATE()),
('LIDER TECNICO JAVA', 1, GETDATE()),
('Líder CUSO', 1, GETDATE()),
('Líder de Análisis', 1, GETDATE()),
('Líder de gestión de Insumos', 1, GETDATE()),
('Líder de Infraestructura', 1, GETDATE()),
('Líder de Performance', 1, GETDATE()),
('Líder de Proyecto', 1, GETDATE()),
('Líder de Proyecto PM', 1, GETDATE()),
('Líder de Pruebas', 1, GETDATE()),
('Líder Técnico', 1, GETDATE()),
('Mercadotecnia', 1, GETDATE()),
('MUREX', 1, GETDATE()),
('Node JS', 1, GETDATE()),
('OPERADOR DE INCIDENCIAS', 1, GETDATE()),
('Oracle PL/SQL', 1, GETDATE()),
('Oracle PLSQL', 1, GETDATE()),
('ORACLE RELATE', 1, GETDATE()),
('Power BI', 1, GETDATE()),
('PRACTICANTE DE PROCESOS', 1, GETDATE()),
('PRACTICANTE DE SEGURIDAD', 1, GETDATE()),
('PRACTICANTE PM', 1, GETDATE()),
('PRACTICANTE TEMPORAL', 1, GETDATE()),
('Programador Delphi', 1, GETDATE()),
('Programador GUPTA', 1, GETDATE()),
('Project Manager', 1, GETDATE()),
('QA', 1, GETDATE()),
('React Native', 1, GETDATE()),
('Recepción', 1, GETDATE()),
('Redes', 1, GETDATE()),
('Relaciones Públicas', 1, GETDATE()),
('Responsable de Comunicación', 1, GETDATE()),
('Responsable Soporte Técnico', 1, GETDATE()),
('RPA', 1, GETDATE()),
('SAP Hybris', 1, GETDATE()),
('Sap SD', 1, GETDATE()),
('Scrum Master', 1, GETDATE()),
('SEGURIDAD TI', 1, GETDATE()),
('SharePoint', 1, GETDATE()),
('SOA Suite', 1, GETDATE()),
('SOPORTE', 1, GETDATE()),
('SOPORTE DE APLICACIONES', 1, GETDATE()),
('SOPORTE TECNICO', 1, GETDATE()),
('soporte tecnico', 1, GETDATE()),
('Subgerente de valores', 1, GETDATE()),
('Tester', 1, GETDATE()),
('TRACKER', 1, GETDATE()),
('Traductor Negocio', 1, GETDATE())


-- columna IdPuesto y telefono en usuarios
ALTER TABLE [dbo].[Usuarios]
ADD IdPuesto INT NULL,
    Telefono VARCHAR(20) NULL;

ALTER TABLE [dbo].[Usuarios]
ADD CONSTRAINT FK_Usuarios_Puestos_IdPuesto
FOREIGN KEY (IdPuesto) REFERENCES [dbo].[Puestos](Id);


-- agregar la nueva columna a la config de t¿columnas

INSERT INTO [dbo].[ConfiguracionColumnas]
           ([Llave]
           ,[Valor]
           ,[TipoFormato]
           ,[FechaRegistro]
           ,[FechaModificacion])
     VALUES
           ('puesto'
           ,'Puesto'
           ,'text'
           ,GETDATE()
           ,NULL)
GO

-- agregar la columna por default
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
           ,60
           ,1
           ,0
           ,0
           ,0
           ,10
           ,GETDATE()
           ,NULL)
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
           ,43
           ,1
           ,0
           ,0
           ,0
           ,11
           ,GETDATE()
           ,NULL)
GO
