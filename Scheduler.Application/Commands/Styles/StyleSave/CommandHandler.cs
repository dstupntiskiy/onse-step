using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Styles.StyleSave;

public class CommandHandler(IRepository<Style> styleRepository) : IRequestHandler<Command, Style>
{
    public async Task<Style> Handle(Command request, CancellationToken cancellationToken)
    {
        if (styleRepository.Query().Any(x => x.Name.ToLower() == request.Name.ToLower() && x.Id != request.Id))
        {
            throw new ValidationException($"Направление с именем {request.Name} уже существует");
        }
        
        var style = await styleRepository.GetById(request.Id);
        style = style ?? new Style();
        style.Name = request.Name;
        style.BasePrice = request.BasePrice;
        style.SecondaryPrice = request.SecondaryPrice;
        style.OnetimeVisitPrice = request.OnetimeVisitPrice;
        style.BaseSalary = request.BaseSalary;
        style.BonusSalary = request.BonusSalary;

        return await styleRepository.AddAsync(style);
    }
}