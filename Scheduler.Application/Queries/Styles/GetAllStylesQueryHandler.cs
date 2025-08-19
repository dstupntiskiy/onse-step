using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Styles;

public class GetAllStylesQueryHandler(IRepository<Style> styleRepository) : IRequestHandler<GetAllStylesQuery, List<Style>>
{
    public async Task<List<Style>> Handle(GetAllStylesQuery request, CancellationToken cancellationToken)
    {
        var styles = styleRepository.Query().Where(x => x.Active == request.OnlyActive || !request.OnlyActive).ToList();
        return styles.OrderBy(x => x.Name).ToList();
    }
}