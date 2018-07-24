using System.ComponentModel.DataAnnotations;

namespace vega.Controllers.Resources
{
    public class ContactResource
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Phone { get; set; }

        [Required]
        public string Email { get; set; }

    }
}