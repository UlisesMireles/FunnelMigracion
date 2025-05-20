

ALTER TABLE Menus ADD ColorIcono VARCHAR(10);
GO

UPDATE Menus SET ColorIcono = '#ffee58' WHERE IdMenu = 1;
GO
UPDATE Menus SET ColorIcono = '#00e676' WHERE IdMenu = 2;
GO
UPDATE Menus SET ColorIcono = '#bdbdbd' WHERE IdMenu = 3;
GO
UPDATE Menus SET ColorIcono = '#fb8c00' WHERE IdMenu = 4;
GO
UPDATE Menus SET ColorIcono = '#ab47bc' WHERE IdMenu = 5;
GO
UPDATE Menus SET ColorIcono = '#ffffff' WHERE IdMenu = 6;
GO