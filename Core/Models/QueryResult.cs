using System.Collections.Generic;

namespace vega.Core.Models
{
    public class QueryResult<T>
    {
        public int Total { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}