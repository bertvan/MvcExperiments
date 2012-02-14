using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
			var birds = new [] { "Vink", "Mus", "Papegaai", "Test", "Ooievaar", "Parkiet" };

			var matchingBirds = birds
				.Where(x => x.ToLowerInvariant().Contains(term.ToLowerInvariant()))
				.ToArray();

			return Json(matchingBirds, JsonRequestBehavior.AllowGet);
		}
	}
}
