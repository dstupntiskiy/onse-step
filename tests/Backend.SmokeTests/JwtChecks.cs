using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scheduler.Models;

internal static class JwtChecks
{
    public static async Task Run(IServiceProvider services)
    {
        var auth = services.GetRequiredService<IOptions<AuthOptions>>().Value;
        var bearer = services.GetRequiredService<IOptionsMonitor<JwtBearerOptions>>()
            .Get(JwtBearerDefaults.AuthenticationScheme);
        var subject = Guid.NewGuid().ToString();
        var writer = new JwtSecurityTokenHandler();
        string Token(string audience, DateTime expiry, SecurityKey key) => writer.WriteToken(
            new JwtSecurityToken(auth.Issuer, audience, [new Claim(JwtRegisteredClaimNames.Sub, subject)],
                expires: expiry, signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)));

        // Production token generation uses JwtSecurityTokenHandler while ASP.NET
        // validates with its configured handlers. Exercise both after IdentityModel's upgrade.
        var valid = Token(auth.Audience, DateTime.UtcNow.AddMinutes(10), auth.GetSymmetricSecurityKey());
        foreach (var handler in bearer.TokenHandlers)
        {
            var result = await handler.ValidateTokenAsync(valid, bearer.TokenValidationParameters);
            if (!result.IsValid || !result.ClaimsIdentity.Claims.Any(c =>
                    (c.Type == ClaimTypes.NameIdentifier || c.Type == JwtRegisteredClaimNames.Sub) && c.Value == subject))
                throw new Exception("A valid application JWT must preserve the subject.");

            foreach (var invalid in new[]
            {
                Token("wrong-audience", DateTime.UtcNow.AddMinutes(10), auth.GetSymmetricSecurityKey()),
                Token(auth.Audience, DateTime.UtcNow.AddHours(-1), auth.GetSymmetricSecurityKey()),
                Token(auth.Audience, DateTime.UtcNow.AddMinutes(10), new SymmetricSecurityKey(new byte[32]))
            })
            {
                if ((await handler.ValidateTokenAsync(invalid, bearer.TokenValidationParameters)).IsValid)
                    throw new Exception("JWT with invalid audience, expiry or signature was accepted.");
            }
        }
        Console.WriteLine("PASS: IdentityModel accepts valid JWTs and rejects invalid audience, expiry and signature.");
    }
}
