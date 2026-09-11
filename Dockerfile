# Build the Angular frontend from its lockfile.
FROM node:22-bookworm-slim AS angular-build
WORKDIR /app/NewClient

COPY NewClient/package.json NewClient/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY NewClient/ ./
RUN npm run build -- --configuration production

# Publish the API and its dependencies.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
WORKDIR /src

COPY Scheduler.sln global.json ./
COPY Scheduler.Application/Scheduler.Application.csproj Scheduler.Application/
COPY Scheduler.Infrastructure/Scheduler.Infrastructure.csproj Scheduler.Infrastructure/
COPY Scheduler.Web/Scheduler.Web.csproj Scheduler.Web/
RUN dotnet restore Scheduler.sln

COPY Scheduler.Application/ Scheduler.Application/
COPY Scheduler.Infrastructure/ Scheduler.Infrastructure/
COPY Scheduler.Web/ Scheduler.Web/
RUN dotnet publish Scheduler.Web/Scheduler.Web.csproj -c Release --no-restore -o /app/publish /p:UseAppHost=false

# Serve the frontend and API together on port 5000.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 5000

COPY --from=dotnet-build /app/publish .
COPY --from=angular-build /app/NewClient/dist/browser/ ./wwwroot/

ENTRYPOINT ["dotnet", "Scheduler.Web.dll"]
