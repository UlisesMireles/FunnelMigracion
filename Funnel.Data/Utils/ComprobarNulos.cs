using System.Text.Json;

namespace Funnel.Data.Utils
{
    public static class ComprobarNulos
    {
        public static T CheckNull<T>(object obj)
        {
            return (obj == DBNull.Value ? default(T) : (T)obj);
        }

        public static int CheckIntNull(object obj)
        {
            return obj == DBNull.Value || obj == null ? 0 : Convert.ToInt32(obj);
        }
        public static decimal CheckDecimalNull(object obj)
        {
            return obj == DBNull.Value || obj == null ? 0 : Convert.ToDecimal(obj);
        }

        public static string CheckStringNull(object obj)
        {
            return obj == DBNull.Value || obj == null ? string.Empty : Convert.ToString(obj);
        }

        public static Boolean CheckBooleanNull(object obj)
        {
            bool flag = false;
            return obj == DBNull.Value || obj == null ? flag : Convert.ToBoolean(obj);
        }

        public static DateTime CheckDateTimeNull(object obj)
        {
            DateTime dt = default(DateTime);
            return obj == DBNull.Value || string.IsNullOrEmpty(obj.ToString()) ? dt : Convert.ToDateTime(obj);
        }

        public static TimeSpan CheckTimeNull(object obj)
        {
            TimeSpan dt = default(TimeSpan);
            return obj == DBNull.Value || obj == null ? dt : (TimeSpan)(obj);
        }

        public static string CheckShortDateStringNull(object obj)
        {
            DateTime dt = default(DateTime);
            DateTime dtObj = Convert.ToDateTime(obj);
            return obj == DBNull.Value || obj == null ? dt.ToShortDateString() : dtObj.ToShortDateString();
        }
        public static decimal CheckJsonPropertyDecimalNull(JsonElement obj, string propiedad)
        {
            return obj.TryGetProperty(propiedad, out var valueCreditos) ? decimal.Parse(obj.GetProperty(propiedad).ToString()) : 0;
        }
        public static DateTime CheckJsonPropertyDateTimeNull(JsonElement obj, string propiedad)
        {
            return obj.TryGetProperty(propiedad, out var valueCreditos) ? Convert.ToDateTime(obj.GetProperty(propiedad).ToString()) : new DateTime();
        }
    }
}
