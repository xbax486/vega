using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }

        public ModelResource ModelResource { get; set; }

        public bool IsRegistered { get; set; }

        public ContactResource ContactResource { get; set; }

        public DateTime LastUpdated { get; set; }

        public ICollection<FeatureResource>  FeatureResources { get; set; }

        public VehicleResource()
        {
            FeatureResources = new Collection<FeatureResource>();
        }
    }
}