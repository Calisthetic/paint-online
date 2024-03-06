namespace PaintOnlineAPI.Models
{
    public class DrawingData
    {
        public string Type { get; set; } = null!;
        public string Color { get; set; } = null!;
        public float Opacity { get; set; }
        public int Width { get; set; }
        public List<Point> Points { get; set; } = new List<Point>();
    }

    public class Point
    {
        public float X { get; set; }
        public float Y { get; set; }
    }
}
