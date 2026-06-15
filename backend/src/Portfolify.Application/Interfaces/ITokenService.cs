using Portfolify.Domain.Entities;

namespace Portfolify.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
