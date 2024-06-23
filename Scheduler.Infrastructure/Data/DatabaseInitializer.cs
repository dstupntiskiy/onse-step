using Microsoft.EntityFrameworkCore;

namespace Scheduler.Infrastructure.Data;

public class DatabaseInitializer(OneStepContext Context)
{
    public void Initialize()
    {
        Context.Database.Migrate();
    }
}