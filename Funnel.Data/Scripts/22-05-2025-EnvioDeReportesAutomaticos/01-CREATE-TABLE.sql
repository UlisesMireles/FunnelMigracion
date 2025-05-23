CREATE TABLE UsuariosReportesAutomaticos (
	Id int IDENTITY(1,1) NOT NULL,
	IdEmpresa int NOT NULL,
	IdReporte int NOT NULL,
	IdUsuarioEnviar int NOT NULL,
	UsuarioRegistro int NULL,
	FechaRegistro datetime NULL,
	CONSTRAINT PK_UsuariosReportesAutomaticos PRIMARY KEY (Id)
);