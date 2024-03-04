using Microsoft.AspNetCore.SignalR;

namespace PaintOnlineAPI.Hubs
{
    public interface IPaintHubClient
    {
        Task SendOffersToUser(List<string> message);
    }
    public class PaintHub : Hub<IPaintHubClient>
    {
        public async Task SendOffersToUser(List<string> message)
        {
            await Clients.All.SendOffersToUser(message);
            //Groups
            //Context.Abort();
        }
    }
}
