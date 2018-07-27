namespace vega.Extensions
{
    public interface IQueryObject
    {
        string SortBy { get; set; }
        bool isSortAscending { get; set; }
        int Page { get; set; }
        int PageSize { get; set; }
    }
}