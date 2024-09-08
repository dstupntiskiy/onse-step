using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Scheduler.Handlers;
using Scheduler.Models;

namespace Scheduler.Extentions;

public static class ConfigureAuthorization
{
    public static IServiceCollection ConfigureAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var authOptionsSection = configuration.GetSection("Auth");
        var authOptions = authOptionsSection.Get<AuthOptions>();
        services.Configure<AuthOptions>(authOptionsSection)
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = authOptions.Issuer,

                        ValidateAudience = true,
                        ValidAudience = authOptions.Audience,
                        IssuerSigningKey = authOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true
                    };
                });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("SuperAdminOnly", policy =>
            {
                policy.Requirements.Add(new SuperAdminRequirement());
            });
        });


        return services;
    }
}