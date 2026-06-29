# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY src/Portfolify.Domain/Portfolify.Domain.csproj src/Portfolify.Domain/
COPY src/Portfolify.Application/Portfolify.Application.csproj src/Portfolify.Application/
COPY src/Portfolify.Infrastructure/Portfolify.Infrastructure.csproj src/Portfolify.Infrastructure/
COPY src/Portfolify.Persistence/Portfolify.Persistence.csproj src/Portfolify.Persistence/
COPY src/Portfolify.API/Portfolify.API.csproj src/Portfolify.API/
RUN dotnet restore src/Portfolify.API/Portfolify.API.csproj

COPY . .
RUN dotnet publish src/Portfolify.API/Portfolify.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Portfolify.API.dll"]
