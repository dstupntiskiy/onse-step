using NHibernate.Cfg;

namespace Scheduler.Infrastructure.Extentions.Strategies;

public class PreserveCaseNamingStrategy : INamingStrategy
{
    public string ClassToTableName(string className)
    {
        return className;
    }

    public string ColumnName(string columnName)
    {
        return columnName;
    }

    public string PropertyToTableName(string className, string propertyName)
    {
        return propertyName;
    }

    public string PropertyToColumnName(string propertyName)
    {
        return propertyName;
    }

    public string TableName(string tableName)
    {
        return tableName;
    }

    public string LogicalColumnName(string columnName, string propertyName)
    {
        return string.IsNullOrEmpty(columnName) ? propertyName : columnName;
    }
}