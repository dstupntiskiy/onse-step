using System.Net;
using System.Runtime.Serialization;

namespace Scheduler.Application.Exceptions;

[Serializable]
public class UserException : Exception
{
    public HttpStatusCode Code;
    public UserException(HttpStatusCode code, string message)
        : base(message)
    {
        this.Code = code;
    }
}