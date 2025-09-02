ALTER TABLE Prospectos
ADD UsuarioCreador INT NULL
CONSTRAINT FK_Prospectos_Usuarios FOREIGN KEY (UsuarioCreador) 
REFERENCES Usuarios(IdUsuario);

ALTER TABLE ContactosProspectos
ADD UsuarioCreador INT NULL
CONSTRAINT FK_ContactosProspectos_Usuarios FOREIGN KEY (UsuarioCreador) 
REFERENCES Usuarios(IdUsuario);