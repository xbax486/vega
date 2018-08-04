using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Core.Models;
using vega.Core;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        private readonly IVehicleRepository iVehicleRepository;
        private readonly IPhotoRepository iPhotoRepository;
        private readonly IUnitOfWork unitOfWork;

        public VehiclesController(
            IMapper mapper,
            IVehicleRepository iVehicleRepository,
            IPhotoRepository iPhotoRepository,
            IUnitOfWork unitOfWork)
        {
            this.mapper = mapper;
            this.iPhotoRepository = iPhotoRepository;
            this.iVehicleRepository = iVehicleRepository;
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<QueryResultResource<VehicleResource>> GetVehicles(VehicleQueryResource vehicleQueryResource)
        {
            var vehicleQuery = mapper.Map<VehicleQueryResource, VehicleQuery>(vehicleQueryResource);
            var queryResult = await iVehicleRepository.GetVehicles(vehicleQuery);
            return mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await iVehicleRepository.GetVehicle(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            var vehicleResource = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(vehicleResource);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdated = DateTime.Now;

            iVehicleRepository.Add(vehicle);
            await unitOfWork.CompleteAsync();

            vehicle = await iVehicleRepository.GetVehicle(vehicle.Id);

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")] // /api/vehicles/{id}
        [Authorize]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = await iVehicleRepository.GetVehicle(id);

            if (vehicle == null)
                return NotFound();

            mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdated = DateTime.Now;

            await unitOfWork.CompleteAsync();
            // return a vehicle with full details 
            vehicle = await iVehicleRepository.GetVehicle(vehicle.Id);
            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await iVehicleRepository.GetVehicle(id, includeRelated: false);
            if (vehicle == null)
            {
                return NotFound();
            }

            var photos = await iPhotoRepository.GetPhotos(vehicle.Id);
            foreach (var photo in photos)
            {
                iPhotoRepository.Remove(photo);
            }
            iVehicleRepository.Remove(vehicle);

            await unitOfWork.CompleteAsync();

            return Ok(id);
        }
    }
}