using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }

        public KeyValuePairResource ModelResource { get; set; }

        public KeyValuePairResource MakeResource { get; set; }

        public bool IsRegistered { get; set; }

        public ContactResource ContactResource { get; set; }

        public DateTime LastUpdated { get; set; }

        public ICollection<KeyValuePairResource>  FeatureResources { get; set; }

        public VehicleResource()
        {
            FeatureResources = new Collection<KeyValuePairResource>();
        }
    }
}