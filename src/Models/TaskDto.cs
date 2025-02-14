namespace QuickTask.Models;

public class TaskDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Text { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public string Owner { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
}