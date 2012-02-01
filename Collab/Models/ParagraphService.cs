using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Collab.Models
{
    public class ParagraphService
    {
        static List<Paragraph> paragraphs = new List<Paragraph> 
        { 
            new Paragraph{Id = 0, Text = "bla"},
            new Paragraph{Id = 1, Text = "hihi"},
            new Paragraph{Id = 2, Text = "haha"},
        };

        public Paragraph[] GetParagraphs()
        {
            lock (this)
            {
                return paragraphs.ToArray();
            }
        }

        public void UpdateParagraph(int id, string text)
        {
            lock (this)
            {
                var paragraph = paragraphs.SingleOrDefault(x => x.Id == id);
                if (paragraph != null)
                {
                    paragraph.Text = text;
                }
            }   
        }
    }   
}