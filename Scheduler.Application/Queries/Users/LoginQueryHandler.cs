using System.Net;
using System.Security.Claims;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Exceptions;
using Scheduler.Application.Interfaces;
using Scheduler.Models;
using System.IdentityModel.Tokens.Jwt;

namespace Scheduler.Application.Queries.Users;

public class LoginQueryHandler(IRepository<User> userRepository,
    IOptions<AuthOptions> authOptions): IRequestHandler<LoginQuery, LoginDto>
{
    public async Task<LoginDto> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.Password))
        {
            throw new UserException(HttpStatusCode.Unauthorized, "Логин или пароль не должны быть пустыми");
        }

        var user = userRepository.Query().SingleOrDefault(x => x.Login == request.Login);

        if (user == null)
        {
            throw new UserException(HttpStatusCode.Unauthorized,
                $"Пользователя с логином {request.Login} не существует");
        }
        
        if (!this.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            throw new UserException(HttpStatusCode.Unauthorized, "Неправильный пароль");
        }

        var result = new LoginDto()
        {
            Id = user.Id,
            Login = user.Login,
            JwtToken = this.GenerateJWT(user)
        };

        return result;
    }
    
    private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != passwordHash[i])
                    return false;
            }
            return true;
        }
    }
    
    private string GenerateJWT(User user)
    {
        var authParams = authOptions.Value;

        var securityKey = authParams.GetSymmetricSecurityKey();
        var creadentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>() { 
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, user.Login)
        };

        var token = new JwtSecurityToken(
            authParams.Issuer,
            authParams.Audience,
            claims,
            expires: DateTime.Now.AddSeconds(authParams.TokenLifeTime),
            signingCredentials: creadentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    } 
}