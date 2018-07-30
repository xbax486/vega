using System.IO;
using System.Linq;

namespace vega.Core.Models
{
    public class PhotoSettings
    {
        public int MaxFileSize { get; set; }
        public string[] AcceptedFileTypes { get; set; }

        public bool IsFileTypeSupported(string fileName)
        {
            return AcceptedFileTypes.Any(type => type == Path.GetExtension(fileName).ToLower());
        }
    }
}