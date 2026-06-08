using AutoMapper;
using Portfolify.Application.DTOs;
using ProfileEntity = Portfolify.Domain.Entities.Profile;

namespace Portfolify.Application.Mappings;

public sealed class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<Domain.Entities.User, UserDto>()
            .ForMember(d => d.Role, opt => opt.MapFrom(s => s.Role.ToString()));

        CreateMap<ProfileEntity, ProfileDto>()
            .ForMember(d => d.Visibility, opt => opt.MapFrom(s => s.Visibility.ToString()));

        CreateMap<Domain.Entities.ProfileLink, ProfileLinkDto>();
    }
}
