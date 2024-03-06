using Microsoft.AspNetCore.SignalR;
using PaintOnlineAPI.Models;
using System.Diagnostics;

namespace PaintOnlineAPI.Hubs
{
    public interface IPaintHubClient
    {
        Task SendOffersToUser(List<string> message);
    }
    public class PaintHub : Hub
    {
        public async Task SendDrawing(DrawingData drawingData)
        {
            await Clients.Others.SendAsync("ReceiveDrawing", drawingData);
        }
    }
}
