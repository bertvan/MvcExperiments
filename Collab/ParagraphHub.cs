using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;
using Collab.Models;

namespace Collab
{
    [HubName("paragraphHub")]
    public class ParagraphHub : Hub
    {
        //public void Send(int id, string text)
        public void Send(dynamic stuff)
        {
            var id = (int)stuff["id"];
            var text = stuff["text"];
			text = HttpUtility.HtmlDecode(text);

            var service = new ParagraphService();
            service.UpdateParagraph(id, text);

            var paragraphs = service.GetParagraphs();
            Clients.reloadParagraphs(paragraphs);
        }
    }
}