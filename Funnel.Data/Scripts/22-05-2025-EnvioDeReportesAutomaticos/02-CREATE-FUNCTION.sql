CREATE FUNCTION [dbo].[STRING_SPLIT](
    @string nvarchar(max), 
    @separator varchar(10))
RETURNS @returnList TABLE
(
	[value] [nvarchar](500)
)
AS
BEGIN
    DECLARE @name nvarchar(max);
    DECLARE @pos int;

    WHILE CHARINDEX(@separator, @string) > 0
    BEGIN
        SELECT @pos = CHARINDEX(@separator, @string);
        SELECT @name = SUBSTRING(@string, 1, @pos - 1);
        INSERT INTO @returnList
            SELECT @name;
        SELECT @string = SUBSTRING(@string, @pos + 1, LEN(@string) - @pos);
    END;

    INSERT INTO @returnList
        SELECT @string;

    RETURN;
END;