# one-step

Dance studio scheduling and membership administration.

Backend: .NET 9 SDK (selected by global.json), ASP.NET Core / EF Core 9.0.19,
and Npgsql EF provider 9.0.4. Docker uses .NET 9 SDK and ASP.NET runtime images.

Build and publish:

    cd NewClient
    npm ci
    npm run build -- --configuration production
    cd ..
    dotnet restore Scheduler.sln
    dotnet build Scheduler.sln -c Release --no-restore
    dotnet publish Scheduler.Web/Scheduler.Web.csproj -c Release --no-restore -o artifacts/publish

Run from the backend directory so appsettings.json is found:

    cd Scheduler.Web
    dotnet run

Configure ConnectionStrings__DefaultConnection and Auth__Issuer, Auth__Audience,
Auth__Secret for the target environment. Startup automatically applies EF database
migrations. The API listens on port 5000.

Offline compatibility checks (no database changes):

    dotnet run --project tests/Backend.SmokeTests -c Release

These compare the EF model with the migration snapshot, generate PostgreSQL
migration SQL, construct NHibernate mappings, and exercise OpenAPI and
unauthenticated API requests through Kestrel. They use a dummy connection string,
disable NHibernate database keyword discovery, and skip the database initializer.
Actual database operations require a separate integration environment.

The build retains existing nullable/compiler warnings and the NuGet advisory for
AutoMapper 13.0.1; this framework upgrade does not change AutoMapper's major version.

The Angular frontend and its instructions are in [NewClient](NewClient/README.md).
Build it before publishing the backend to include its assets in `wwwroot`, preserving
subdirectories. The legacy `Client` directory has been removed.

Build the combined frontend/API Docker image from the repository root:

    docker build -t one-step .

The Dockerfile builds `NewClient` with Node.js 22 and `npm ci`, publishes the .NET 9
backend, and serves both from port 5000. Supply the database and authentication
configuration above when running the container. Local dependencies, caches and build
outputs are excluded by `.dockerignore`.
