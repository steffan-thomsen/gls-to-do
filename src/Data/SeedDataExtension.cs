using System.Runtime.CompilerServices;
using QuickTask.Models;

namespace QuickTask.Data;

public static class SeedDataExtension
{
    public static IApplicationBuilder SeedDemoData(this WebApplication applicationBuilder)
    {
        using (var scope = applicationBuilder.Services.CreateScope())
        {
            var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

            const string owner = "john";
            var seedTasks = new List<TaskDto>()
            {
                new()
                {
                    Text = "Ask ChatGPT how to write a todo-app",
                    Owner = owner,
                    IsCompleted = true,
                },
                new()
                {
                    Text = "Find a fancy name",
                    Owner = owner,
                    IsCompleted = true,
                },
                new()
                {
                    Text = "Write a beautiful backend API",
                    Owner = owner,
                    IsCompleted = true,
                },
                new()
                {
                    Text = "Write a ..<i>functional</i>.. frontend",
                    Owner = owner,
                    IsCompleted = true,
                },
                new()
                {
                    Text = "Weed out all the bugs",
                    Owner = owner,
                    IsCompleted = false,
                },
                new()
                {
                    Text = "Make hack-proof",
                    Owner = owner,
                    IsCompleted = false,
                }
            };

            foreach (var task in seedTasks)
            {
                dataContext.Tasks.Add(task);
            }

            dataContext.SaveChanges();
        }

        return applicationBuilder;
    }
}