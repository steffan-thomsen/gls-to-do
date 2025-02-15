using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuickTask.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", false);
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddJsonFile("appsettings.Development.json", true);
}

// We need to store data somewhere
builder.Services.AddDbContext<DataContext>(optionsBuilder =>
{
    optionsBuilder.UseInMemoryDatabase("gls_tasks");
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen();

// Add JWT Auth
var jwtConfig = builder.Configuration.GetRequiredSection("JwtSettings");
var secret = Convert.FromBase64String(jwtConfig.GetValue<string>("SecurityKey")!);

builder.Services.AddAuthentication().AddJwtBearer(opts =>
{
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        // ValidIssuer = "http://quick-task/auth",
        ValidIssuer = "http://localhost:8080",
        ValidateAudience = true,
        // ValidAudience = "http://quick-task/task",
        ValidAudience = "http://localhost:8080",
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(secret)
    };
});

var app = builder.Build();

// This is purely to add some test data. Login with the user `john` to see it.
app.SeedDemoData(); 

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapDefaultControllerRoute();
    

app.Run();