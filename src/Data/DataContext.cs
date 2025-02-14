using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory.Storage.Internal;
using QuickTask.Models;

namespace QuickTask.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> contextOptions) : base(contextOptions)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskDto>().HasKey(q => q.Id);
        base.OnModelCreating(modelBuilder);
    }

    public DbSet<TaskDto> Tasks { get; set; }
}