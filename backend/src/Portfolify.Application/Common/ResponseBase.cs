namespace Portfolify.Application.Common;

public record Response<T>(T Data, bool IsSuccess, string? ErrorMessage = null)
{
    public static Response<T> Success(T data) => new(data, true);

    public static Response<T> Failure(string errorMessage) => new(default!, false, errorMessage);
}

public record PagedResponse<T>(IReadOnlyCollection<T> Items, int TotalCount, int PageNumber, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}
