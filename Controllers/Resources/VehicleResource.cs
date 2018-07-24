using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }
        public int ModelId { get; set; }

        public bool IsRegistered { get; set; }

        [Required]
        public ContactResource ContactResource { get; set; }

        public ICollection<int>  VehicleFeatureIds { get; set; }

        public VehicleResource()
        {
            VehicleFeatureIds = new Collection<int>();
        }
    }
}