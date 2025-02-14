using Microsoft.AspNetCore.Mvc;

namespace QuickTask.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return RedirectPermanent($"/Index.html");
    }
}