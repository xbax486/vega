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

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObject)
        {
            queryObject.Page = queryObject.Page <= 0 ? 1 : queryObject.Page;
            queryObject.PageSize = queryObject.PageSize <= 0 ? 10 : queryObject.PageSize;

            return query
                .Skip((queryObject.Page - 1) * queryObject.PageSize)
                .Take(queryObject.PageSize);
        }
    }
}