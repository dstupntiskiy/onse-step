using Microsoft.AspNetCore.Authentication.JwtBearer;
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

                        /* Not Validating token lifetime
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        */
                        IssuerSigningKey = authOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true
                    };
                });

        return services;
    }
}