using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Styles;

public class GetAllStylesQueryHandler(IRepository<Style> styleRepository) : IRequestHandler<GetAllStylesQuery, List<Style>>
{
    public async Task<List<Style>> Handle(GetAllStylesQuery request, CancellationToken cancellationToken)
    {
        var styles = await styleRepository.GetAll();
        return styles.OrderBy(x => x.Name).ToList();
    }
}