using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PaintOnlineAPI.Hubs;

namespace PaintOnlineAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FiguresController : ControllerBase
    {
        //private IHubContext<PaintHub, IPaintHubClient> paintHub;
        //public FiguresController(IHubContext<PaintHub, IPaintHubClient> _paintHub)
        //{
        //    paintHub = _paintHub;
        //}
        //[HttpPost]
        //[Route("productoffers")]
        //public string Get()
        //{
        //    List<string> offers = new List<string>();
        //    offers.Add("Draw cube");
        //    paintHub.Clients.All.SendOffersToUser(offers);
        //    return "Offers sent successfully to all users!";
        //}
    }
}
