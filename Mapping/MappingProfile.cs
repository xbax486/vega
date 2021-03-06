using AutoMapper;
using vega.Controllers.Resources;
using vega.Core.Models;
using System.Linq;
using System.Collections.Generic;

namespace vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Domain to API Resource
            CreateMap<Photo, PhotoResource>();
            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<Make, MakeResource>();
            CreateMap<Make, KeyValuePairResource>();
            CreateMap<Model, KeyValuePairResource>();
            CreateMap<Feature, KeyValuePairResource>();
            CreateMap<Vehicle, SaveVehicleResource>()
                .ForMember(
                    saveVehicleResource => saveVehicleResource.ContactResource, 
                    opt => opt.MapFrom(
                        vehicle => new ContactResource{ 
                            Name = vehicle.ContactName,
                            Phone = vehicle.ContactPhone,
                            Email = vehicle.ContactEmail 
                        }
                    )
                )
                .ForMember(
                    saveVehicleResource => saveVehicleResource.VehicleFeatureIds,
                    opt => opt.MapFrom(
                        vehicle => vehicle.VehicleFeatures.Select(
                            vehicleFeature => vehicleFeature.FeatureId
                        )
                    )
                );
            CreateMap<Vehicle, VehicleResource>()
                .ForMember(
                    vehicleResource => vehicleResource.ModelResource,
                    opt => opt.MapFrom(
                        vehicle => vehicle.Model
                    )
                )
                .ForMember(
                    vehicleResource => vehicleResource.MakeResource,
                    opt => opt.MapFrom(
                        vehicle => vehicle.Model.Make
                    )
                )
                .ForMember(
                    vehicleResource => vehicleResource.ContactResource, 
                    opt => opt.MapFrom(
                        vehicle => new ContactResource{ 
                            Name = vehicle.ContactName,
                            Phone = vehicle.ContactPhone,
                            Email = vehicle.ContactEmail 
                        }
                    )
                )
                .ForMember(
                    vehicleResource => vehicleResource.FeatureResources,
                    opt => opt.MapFrom(
                        vehicle => vehicle.VehicleFeatures.Select(
                            vehicleFeature => new KeyValuePairResource{
                                Id = vehicleFeature.Feature.Id,
                                Name = vehicleFeature.Feature.Name
                            }
                        )
                    )
                );

            //API Resource to Domain
            CreateMap<VehicleQueryResource, VehicleQuery>();

            CreateMap<SaveVehicleResource, Vehicle>()
                .ForMember(
                    vehicle => vehicle.Id,
                    opt => opt.Ignore()
                )
                .ForMember(
                    vehicle => vehicle.ContactName, 
                    opt => opt.MapFrom(vehicleResource => vehicleResource.ContactResource.Name)
                )
                .ForMember(
                    vehicle => vehicle.ContactPhone, 
                    opt => opt.MapFrom(vehicleResource => vehicleResource.ContactResource.Phone)
                )
                .ForMember(
                    vehicle => vehicle.ContactEmail, 
                    opt => opt.MapFrom(vehicleResource => vehicleResource.ContactResource.Email)
                )
                .ForMember(
                    vehicle => vehicle.VehicleFeatures, 
                    opt => opt.Ignore()
                )
                .AfterMap(
                   (vehicleResource, vehicle) => {
                        /* Remove unselected features */
                        var removedFeatures = vehicle.VehicleFeatures
                            .Where(f => !vehicleResource.VehicleFeatureIds.Contains(f.FeatureId))
                            .ToList();
                        foreach(var removedFeature in removedFeatures){
                            vehicle.VehicleFeatures.Remove(removedFeature);
                        }

                        /* Add new features */
                        var addedFeatures = vehicleResource.VehicleFeatureIds
                            .Where(id => !vehicle.VehicleFeatures.Any(f => f.FeatureId == id))
                            .Select(id => new VehicleFeature{ FeatureId = id })
                            .ToList();
                        foreach(var feature in addedFeatures){
                            vehicle.VehicleFeatures.Add(feature);
                        }
                   } 
                );
                
        }
    }
}