using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace vega.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, IQueryObject queryObject, 
            Dictionary<string, Expression<Func<T, object>>> columnsMap) 
        {
            if (String.IsNullOrWhiteSpace(queryObject.SortBy) || !columnsMap.ContainsKey(queryObject.SortBy))
                return query;

            if(queryObject.isSortAscending)
                query = query.OrderBy(columnsMap[queryObject.SortBy]);
            else
                query.OrderByDescending(columnsMap[queryObject.SortBy]);
            return query;
        }
    }
}