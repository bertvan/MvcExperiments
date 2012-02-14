using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UxPatterns.Models;

namespace UxPatterns.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Message = "Welcome to ASP.NET MVC!";

			return View();
		}

		public ActionResult About()
		{
			return View();
		}

		public ActionResult Birds(string term)
		{
			var birdsData =
				new List<Bird>
				{
					new Bird{Id= 0, Name= "Vink"},
					new Bird{Id= 1, Name= "Mus"},
					new Bird{Id= 2, Name= "Papegaai"},
					new Bird{Id= 3, Name= "Test"},
					new Bird{Id= 4, Name= "Ooievaar"},
					new Bird{Id= 5, Name= "Parkiet"},
					new Bird{Id= 6, Name= "Huismus"},
					new Bird{Id= 7, Name= "Duif"},
					new Bird{Id= 8, Name= "Merel"},
				};

			var matchingBirds = birdsData
				.Where(x => x.Name.ToLowerInvariant().Contains(term.ToLowerInvariant()))
				.Select(x => new { id = x.Id, value = x.Name })
				.ToArray();

			return Json(matchingBirds, JsonRequestBehavior.AllowGet);
		}
	}
}
