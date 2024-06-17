# Stage 1 Build Angular app
FROM node:20 AS angular-build
WORKDIR /app

COPY Client/package*.json ./Client/
WORKDIR /app/Client
RUN npm install --force

COPY Client/. .
RUN npm run build --prod

FROM mcr.microsoft.com/dotnet/sdk:8.0.302 AS dotnet-build
WORKDIR /src

COPY Scheduler.sln ./
COPY Scheduler.Application/Scheduler.Application.csproj Scheduler.Application/
COPY Scheduler.Infrastructure/Scheduler.Infrastructure.csproj Scheduler.Infrastructure/
COPY Scheduler.Web/Scheduler.Web.csproj Scheduler.Web/

# Restore dependencies for each project separately
RUN dotnet restore Scheduler.Application/Scheduler.Application.csproj --force -m:1
RUN dotnet restore Scheduler.Infrastructure/Scheduler.Infrastructure.csproj --force -m:1
RUN dotnet restore Scheduler.Web/Scheduler.Web.csproj --force -m:1

COPY . .

RUN dotnet build Scheduler.sln -c Release --no-self-contained -m:1

RUN dotnet publish Scheduler.Web/Scheduler.Web.csproj -c Release -o /app/publish --no-self-contained -m:1

# Stage 3: Create final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5000

# Copy the build output and Angular build output to the final stage
COPY --from=dotnet-build /app/publish .
COPY --from=angular-build /app/Client/dist/shceduler-app/browser/ ./wwwroot/

# Set the entry point for the application
ENTRYPOINT ["dotnet", "Scheduler.Web.dll"]