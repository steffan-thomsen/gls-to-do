using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace QuickTask.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    
    /// <summary>
    /// There's no need to look for mistakes here :)
    /// This method is mock and not actual authentication.
    /// No matter the username a valid token is returned
    /// DO NOT MODIFY! 
    /// </summary>
    /// <param name="userName">The user who is logging in</param>
    /// <returns>A 30 minute valid JWT with the "nameid" claim set to the provided userName</returns>
    [HttpPost]
    [Route("Authenticate")]
    public async Task<IActionResult> Authenticate(string userName)
    {
        var jwtSettings = _configuration.GetRequiredSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("SecurityKey");
        var issuer = jwtSettings.GetValue<string>("Issuer");
        var audience = jwtSettings.GetValue<string>("Audience");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.NameId, userName),
        };

        var key = new SymmetricSecurityKey(Convert.FromBase64String(secretKey!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(30), // Token expiry time
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(jwt);
    }
}