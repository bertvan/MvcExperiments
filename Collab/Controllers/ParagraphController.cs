using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Collab.Models;

namespace Collab.Controllers
{
	public class ParagraphController : Controller
	{
		public ActionResult List()
		{
			var service = new ParagraphService();
			var model = service.GetParagraphs();

			return Json(model, JsonRequestBehavior.AllowGet);
		}
	}
}