using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickTask.Data;
using QuickTask.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace QuickTask.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : Controller
{
    private readonly DataContext _dataContext;

    public TaskController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    private string? GetUserName()
    {
        var authHeader = HttpContext.Request.Headers.Authorization.ToString();
        var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..] : authHeader;
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var userName = jwt.Claims.Single(c => c.Type == JwtRegisteredClaimNames.NameId).Value;

        return userName;
    }
    

    [Authorize]
    [HttpGet("List")]
    public async Task<IActionResult> List(string userName)
    {
        var tokenUser = GetUserName();
        if (tokenUser is null) return Unauthorized();

        var tasks = await _dataContext.Tasks.Where(q => q.Owner == userName).OrderBy(q => q.CreatedTime).ToListAsync();

        return Ok(tasks);
    }
    

    [Authorize]
    [HttpPost("Add")]
    public async Task<IActionResult> Add(TaskDto task)
    {
        var userName = GetUserName();
        if (userName is null) return Unauthorized();

        await _dataContext.Tasks.AddAsync(task);
        await _dataContext.SaveChangesAsync();

        return Ok(task);
    }
    

    [Authorize]
    [HttpPut("Toggle")]
    public async Task<IActionResult> Add(Guid taskId)
    {
        var userName = GetUserName();
        if (userName is null) return Unauthorized();

        var task = await _dataContext.Tasks.SingleOrDefaultAsync(t => t.Id == taskId);
        if (task is null) return NotFound();

        task.IsCompleted = !task.IsCompleted;
        await _dataContext.SaveChangesAsync();

        return Ok(task);
    }
    

    [Authorize]
    [HttpDelete("Remove")]
    public async Task<IActionResult> Remove(Guid taskId)
    {
        var userName = GetUserName();
        if (userName is null) return Unauthorized();

        var task = await _dataContext.Tasks.SingleOrDefaultAsync(t => t.Id == taskId);
        if (task is null) return NotFound();

        _dataContext.Tasks.Remove(task);
        _dataContext.SaveChangesAsync();

        return Ok();
    }
}