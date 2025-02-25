using Microsoft.Data.SqlClient;
using System.Data;
using System.Transactions;

namespace Funnel.Data.Utils
{
    public static class DataBase
    {
        private static readonly int commandTimeout = 300;
        #region Data Update handlers

        /// <summary>
        /// Executes Update statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Number of rows affected.</returns>
        public static async Task<int> Update(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;

                    CreateParameters(command, parameters);

                    connection.Open();
                    int result = await command.ExecuteNonQueryAsync();

                    CompleteParameters(command, parameters);

                    return result;
                }
            }
        }

        /// <summary>
        /// Executes Update statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <returns>Number of rows affected.</returns>
        public static async Task<int> Update(string sql, CommandType commandType, string sqlConection)
        {
            return await Update(sql, commandType, null, sqlConection);
        }

        /// <summary>
        /// Executes Update statements in the database return the out params
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameters">Parameters List.</param>
        public static async Task<SqlCommand> UpdateOut(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;
                SqlCommand command = new SqlCommand();

                command.Connection = connection;
                command.CommandType = commandType;
                command.CommandText = sql;
                command.CommandTimeout = commandTimeout;

                CreateParameters(command, parameters);

                connection.Open();
                await command.ExecuteNonQueryAsync();
                CompleteParameters(command, parameters);
                return command;
            }
        }


        /// <summary>
        /// Executes Insert statements in the database. Optionally returns new identifier.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <param name="getId">Value indicating whether newly generated identity is returned.</param>
        /// <returns>Newly generated identity value (autonumber value).</returns>
        public static async Task<int> Insert(string sql, CommandType commandType, IList<Parameter> parameters, bool getId, string sqlConection, string paramid = "@newid")
        {
            string identitySelect = "";
            string parameterName = "";

            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;

                    CreateParameters(command, parameters);

                    if (getId)
                    {
                        if (commandType == CommandType.StoredProcedure)
                        {
                            SqlParameter param = new SqlParameter();
                            param.DbType = DbType.Int32;
                            param.Direction = ParameterDirection.Output;
                            parameterName = paramid;
                            param.Size = 4;
                            param.ParameterName = parameterName;
                            command.Parameters.Add(param);
                        }
                        else
                        {
                            identitySelect = "SELECT SCOPE_IDENTITY()";
                        }
                    }

                    connection.Open();
                    await command.ExecuteNonQueryAsync();

                    int id = -1;
                    if (getId)
                    {
                        if (commandType == CommandType.StoredProcedure)
                        {
                            id = Convert.ToInt32(command.Parameters[parameterName].Value);
                        }
                        else
                        {
                            command.CommandText = identitySelect;
                            id = int.Parse(command.ExecuteScalar().ToString());
                        }
                    }

                    CompleteParameters(command, parameters);

                    return id;
                }
            }
        }

        /// <summary>
        /// Executes Insert statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        public static async Task Insert(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            await Insert(sql, commandType, parameters, false, sqlConection);
        }

        /// <summary>
        /// Executes Insert statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        public static async Task Insert(string sql, CommandType commandType, string sqlConection)
        {
            await Insert(sql, commandType, null, false, sqlConection);
        }

        /// <summary>
        /// Executes Insert statements in the database return the out params
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <param name="getId">Value indicating whether newly generated identity is returned.</param>
        /// <returns>Newly generated identity value (autonumber value).</returns>
        public static async Task<SqlCommand> InsertOut(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;
                SqlCommand command = new SqlCommand();
                command.Connection = connection;
                command.CommandType = commandType;
                command.CommandText = sql;
                command.CommandTimeout = commandTimeout;

                CreateParameters(command, parameters);

                connection.Open();
                await command.ExecuteNonQueryAsync();
                CompleteParameters(command, parameters);
                return command;

            }
        }

        /// <summary>
        /// Executes Insert statements in the database return the out params
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <param name="getId">Value indicating whether newly generated identity is returned.</param>
        /// <returns>Newly generated identity value (autonumber value).</returns>
        public static async Task<SqlCommand> InsertOutSql(string sql, CommandType commandType, IList<ParameterSQl> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;
                SqlCommand command = new SqlCommand();

                command.Connection = connection;
                command.CommandType = commandType;
                command.CommandText = sql;
                command.CommandTimeout = commandTimeout;

                CreateParametersSql(command, parameters);

                connection.Open();
                await command.ExecuteNonQueryAsync();
                CompleteParametersSql(command, parameters);
                return command;
            }
        }


        /// <summary>
        /// Executes Update statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Number of rows affected.</returns>
        public static async Task Execute(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;

                    CreateParameters(command, parameters);

                    connection.Open();
                    await command.ExecuteNonQueryAsync();

                    CompleteParameters(command, parameters);
                }
            }
        }

        public static async Task Execute(string sql, CommandType commandType, string sqlConection)
        {
            await Execute(sql, commandType, null, sqlConection);
        }

        #endregion

        #region Data Retrieve Handlers

        /// <summary>
        /// Populates a DataReader according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Reader with Close Connection behavior.</returns>
        public static async Task<IDataReader> GetReader(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            IDataReader reader = null;

            SqlConnection connection = new SqlConnection();

            try
            {
                connection.ConnectionString = sqlConection;
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;
                    CreateParameters(command, parameters);
                    connection.Open();

                    if (Transaction.Current == null)
                        reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                    else
                        reader = await command.ExecuteReaderAsync(CommandBehavior.Default);
                }
            }
            catch (Exception ex)
            {
                connection?.Close();

                //arrojar mensaje y ademas el detalle de la excepcion
                Console.WriteLine(ex.Message);
            }
            return reader;
        }

        /// <summary>
        /// Populates a DataReader according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <returns>Reader with Close Connection behavior.</returns>
        public static async Task<IDataReader> GetReader(string sql, CommandType commandType, string sqlConection)
        {
            return await GetReader(sql, commandType, null, sqlConection);
        }

        /// <summary>
        /// Populates a DataReader according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Reader with Close Connection behavior.</returns>
        public static async Task<IDataReader> GetReaderSql(string sql, CommandType commandType, IList<ParameterSQl> parameters, string sqlConection)
        {
            IDataReader reader = null;

            SqlConnection connection = new SqlConnection();

            try
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;

                    CreateParametersSql(command, parameters);
                    connection.Open();


                    if (Transaction.Current == null)
                        reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                    else
                        reader = await command.ExecuteReaderAsync(CommandBehavior.Default);
                }
            }
            catch (Exception)
            {
                if (connection != null)
                    connection.Close();
                throw;
            }
            return reader;
        }

        /// <summary>
        /// Populates a DataTable according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Populated DataTable.</returns>
        public static DataTable GetDataTable(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = commandType;
                    command.CommandText = sql;
                    command.CommandTimeout = commandTimeout;

                    CreateParameters(command, parameters);

                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = command;

                        DataTable dt = new DataTable();
                        adapter.Fill(dt);

                        return dt;
                    }
                }
            }
        }

        /// <summary>
        /// Populates a DataTable according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <returns>Populated DataTable.</returns>
        public static DataTable GetDataTable(string sql, CommandType commandType, string sqlConection)
        {
            return GetDataTable(sql, commandType, null, sqlConection);
        }

        /// <summary>
        /// Populates a DataRow according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Populated DataRow.</returns>
        public static DataRow GetDataRow(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            DataRow row = null;

            DataTable dt = GetDataTable(sql, commandType, parameters, sqlConection);
            if (dt.Rows.Count > 0)
            {
                row = dt.Rows[0];
            }

            return row;
        }

        /// <summary>
        /// Populates a DataRow according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <returns>Populated DataRow.</returns>
        public static DataRow GetDataRow(string sql, CommandType commandType, string sqlConection)
        {
            return GetDataRow(sql, commandType, null, sqlConection);
        }

        /// <summary>
        /// Executes a Sql statement and returns a scalar value.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Scalar value.</returns>
        public static async Task<object> GetScalar(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = sql;
                    command.CommandType = commandType;
                    command.CommandTimeout = commandTimeout;

                    CreateParameters(command, parameters);

                    connection.Open();
                    return await command.ExecuteScalarAsync();
                }
            }
        }

        /// <summary>
        /// Executes a Sql statement and returns a scalar value.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <returns>Scalar value.</returns>
        public static async Task<object> GetScalar(string sql, CommandType commandType, string sqlConection)
        {
            return await GetScalar(sql, commandType, null, sqlConection);
        }

        #endregion

        #region Utility methods

        public static Parameter CreateParameter(string name, DbType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value)
        {
            return CreateParameter(name, type, size, direction, nullable, sourceColumn, version, value, 0, 0, ObjectType.None);
        }

        public static Parameter CreateParameter(string name, DbType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value, byte precision, byte scale)
        {
            return CreateParameter(name, type, size, direction, nullable, sourceColumn, version, value, precision, scale, ObjectType.None);
        }

        public static Parameter CreateParameter(string name, DbType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value, byte precision, byte scale, ObjectType additionalType)
        {
            Parameter param = new Parameter();
            param.DbType = type;
            param.Direction = direction;
            param.Name = name;
            param.Nullable = nullable;
            param.Size = size;
            param.SourceColumn = sourceColumn;
            param.SourceVersion = version;
            param.Type = additionalType;
            param.Value = value ?? DBNull.Value;
            param.Scale = scale;
            param.Precision = precision;
            return param;
        }

        public static Parameter CreateParameter(string name, ObjectType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value)
        {
            return CreateParameter(name, type, size, direction, nullable, sourceColumn, version, value, 0, 0, ObjectType.None);
        }

        public static Parameter CreateParameter(string name, ObjectType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value, byte precision, byte scale)
        {
            return CreateParameter(name, type, size, direction, nullable, sourceColumn, version, value, precision, scale, ObjectType.None);
        }

        public static Parameter CreateParameter(string name, ObjectType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value, byte precision, byte scale, ObjectType additionalType)
        {

            Parameter param = new Parameter();
            param.Type = type;
            param.Direction = direction;
            param.Name = name;
            param.Nullable = nullable;
            param.Size = size;
            param.SourceColumn = sourceColumn;
            param.SourceVersion = version;
            param.Value = value ?? DBNull.Value;
            param.Scale = scale;
            param.Precision = precision;
            return param;
        }

        private static void CreateParameters(SqlCommand command, IEnumerable<Parameter> parameters)
        {
            if (parameters != null)
            {
                foreach (Parameter param in parameters)
                {
                    SqlParameter dbparam = new SqlParameter();
                    ConfigureParameter(dbparam, param);
                    command.Parameters.Add(dbparam);
                }
            }
        }

        private static void CompleteParameters(SqlCommand command, IEnumerable<Parameter> parameters)
        {
            if (parameters != null)
            {
                foreach (Parameter param in parameters)
                {
                    if (param.Direction != ParameterDirection.Input)
                    {
                        param.Value = command.Parameters[param.Name].Value;
                    }
                }
            }
        }

        public static ParameterSQl CreateParameterSql(string name, SqlDbType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value)
        {
            return CreateParameterSql(name, type, size, direction, nullable, sourceColumn, version, value, 0, 0, ObjectType.None);
        }

        public static ParameterSQl CreateParameterSql(string name, SqlDbType type, int size, ParameterDirection direction, bool nullable, string sourceColumn, DataRowVersion version, object value, byte precision, byte scale, ObjectType additionalType)
        {
            ParameterSQl param = new ParameterSQl();
            param.DbType = type;
            param.Direction = direction;
            param.Name = name;
            param.Nullable = nullable;
            param.Size = size;
            param.SourceColumn = sourceColumn;
            param.SourceVersion = version;
            param.Type = additionalType;
            param.Value = value ?? DBNull.Value;
            param.Scale = scale;
            param.Precision = precision;
            return param;
        }

        private static void CreateParametersSql(SqlCommand command, IEnumerable<ParameterSQl> parameters)
        {
            if (parameters != null)
            {
                foreach (ParameterSQl param in parameters)
                {
                    SqlParameter dbparam = new SqlParameter();
                    ConfigureParameterSql(dbparam, param);
                    command.Parameters.Add(dbparam);
                }
            }
        }

        private static void CompleteParametersSql(SqlCommand command, IEnumerable<ParameterSQl> parameters)
        {
            if (parameters != null)
            {
                foreach (ParameterSQl param in parameters)
                {
                    if (param.Direction != ParameterDirection.Input)
                    {
                        param.Value = command.Parameters[param.Name].Value;
                    }
                }
            }
        }

        /// Configures a given <see cref="SqlParameter"/>.
        /// </summary>
        /// <param name="param">The <see cref="SqlParameter"/> to configure.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>
        /// <param name="nullable"><para>Avalue indicating whether the parameter accepts <see langword="null"/> (<b>Nothing</b> in Visual Basic) values.</para></param>
        /// <param name="precision"><para>The maximum number of digits used to represent the <paramref name="value"/>.</para></param>
        /// <param name="scale"><para>The number of decimal places to which <paramref name="value"/> is resolved.</para></param>
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>  
        private static void ConfigureParameterSql(SqlParameter dbParam,
                                                  ParameterSQl param)
        {
            dbParam.SqlDbType = param.DbType;
            switch (param.Type)
            {
                case ObjectType.SqlDecimal:
                    dbParam.Precision = param.Precision;
                    dbParam.Scale = param.Scale;
                    break;
            }
            dbParam.ParameterName = param.Name;
            dbParam.Size = param.Size;
            dbParam.Value = param.Value ?? DBNull.Value;
            dbParam.Direction = param.Direction;
            dbParam.IsNullable = param.Nullable;
            dbParam.SourceColumn = param.SourceColumn;
            dbParam.SourceVersion = param.SourceVersion;
        }

        /// <summary>
        /// Configures a given <see cref="SqlParameter"/>.
        /// </summary>
        /// <param name="param">The <see cref="SqlParameter"/> to configure.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>
        /// <param name="nullable"><para>Avalue indicating whether the parameter accepts <see langword="null"/> (<b>Nothing</b> in Visual Basic) values.</para></param>
        /// <param name="precision"><para>The maximum number of digits used to represent the <paramref name="value"/>.</para></param>
        /// <param name="scale"><para>The number of decimal places to which <paramref name="value"/> is resolved.</para></param>
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>  
        private static void ConfigureParameter(SqlParameter dbParam,
                                                  Parameter param)
        {
            dbParam.DbType = param.DbType;
            switch (param.Type)
            {
                case ObjectType.SqlDecimal:
                    dbParam.Precision = param.Precision;
                    dbParam.Scale = param.Scale;
                    break;
                case ObjectType.SqlDataReader:
                    dbParam.SqlDbType = SqlDbType.Structured;

                    break;
            }
            dbParam.ParameterName = param.Name;
            dbParam.Size = param.Size;
            dbParam.Value = param.Value ?? DBNull.Value;
            dbParam.Direction = param.Direction;
            dbParam.IsNullable = param.Nullable;
            dbParam.SourceColumn = param.SourceColumn;
            dbParam.SourceVersion = param.SourceVersion;
        }

        /// <summary>
        /// Executes Update statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="commandType">Command Type: Text, StoreProcedure.</param>
        /// <param name="parameteres">Parameters List.</param>
        /// <returns>Number of rows affected.</returns>
        public static async Task<SqlCommand> ExecuteOut(string sql, CommandType commandType, IList<Parameter> parameters, string sqlConection)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = sqlConection;

                SqlCommand command = new SqlCommand();

                command.Connection = connection;
                command.CommandType = commandType;
                command.CommandText = sql;
                command.CommandTimeout = commandTimeout;

                CreateParameters(command, parameters);

                connection.Open();
                await command.ExecuteNonQueryAsync();

                CompleteParameters(command, parameters);
                return command;

            }
        }
        #endregion
    }
}
