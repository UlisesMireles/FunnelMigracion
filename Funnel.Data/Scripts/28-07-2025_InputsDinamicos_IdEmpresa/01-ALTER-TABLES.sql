ALTER TABLE R_InputsCatalogo ADD IdEmpresa int DEFAULT 1 NOT NULL;
ALTER TABLE InputsAdicionales DROP CONSTRAINT FK_InputsAdicionales_Empresas;
ALTER TABLE InputsAdicionales DROP COLUMN IdEmpresa;
ALTER TABLE R_InputsCatalogo ADD CONSTRAINT FK_R_InputsCatalogo_Empresas FOREIGN KEY (IdEmpresa) REFERENCES Empresas(IdEmpresa);



