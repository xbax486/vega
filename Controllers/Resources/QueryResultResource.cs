using System.Collections.Generic;

namespace vega.Controllers.Resources
{
    public class QueryResultResource<T>
    {
        public int Total { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}