using System.Net;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Exceptions;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Users.RegisterUser;

public class CommandHandler(IRepository<User> userRepository): IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.Password))
        {
            throw new UserException(HttpStatusCode.Unauthorized, "Логин или пароль не могут быть пустыми");
        }

        if (userRepository.Query().Any(x => x.Login == request.Login))
        {
            throw new UserException(HttpStatusCode.Conflict, "Пользователь с таким именем уже существует");
        }
        
        byte[] passwordHash, passwordSalt;
        (passwordHash, passwordSalt) = this.GenerateHash(request.Password);

        var user = new User()
        {
            Login = request.Login,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsSuperAdmin = false
        };

        await userRepository.AddAsync(user);
    }
    
    private (byte[], byte[]) GenerateHash(string password)
    {
        byte[] passwordHash, passwordSalt;
        using (var hmac = new System.Security.Cryptography.HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
        return (passwordHash, passwordSalt);
    }
}