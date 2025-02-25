using System.Data;

namespace Funnel.Data.Utils
{
    public enum ObjectType
    {
        SqlDataReader,
        SqlDecimal,
        Xml,
        None
    }

    public class ParameterSQl
    {
        public string Name { get; set; }
        public SqlDbType DbType { get; set; }
        public ObjectType Type { get; set; }
        public int Size { get; set; }
        public ParameterDirection Direction { get; set; }
        public bool Nullable { get; set; }
        public byte Precision { get; set; }
        public byte Scale { get; set; }
        public string SourceColumn { get; set; }
        public DataRowVersion SourceVersion { get; set; }
        public object Value { get; set; }
    }

    public class Parameter
    {
        public string Name { get; set; }
        public DbType DbType { get; set; }
        public ObjectType Type { get; set; }
        public int Size { get; set; }
        public ParameterDirection Direction { get; set; }
        public bool Nullable { get; set; }
        public byte Precision { get; set; }
        public byte Scale { get; set; }
        public string SourceColumn { get; set; }
        public DataRowVersion SourceVersion { get; set; }
        public object Value { get; set; }
    }
}
