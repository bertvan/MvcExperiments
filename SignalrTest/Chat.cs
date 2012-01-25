using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;

namespace SignalrTest
{
    [HubName("chat")]
    public class Chat : Hub
    {
        public void Send(string message)
        {
            Clients.addMessage(message);
        }

        public void MousePosition(dynamic position)
        {
            var x = position["x"];
            var y = position["y"];

            Clients.setServerMousePosition(x, y);
        }
    }
}