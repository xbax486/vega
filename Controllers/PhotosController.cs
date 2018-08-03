using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IHostingEnvironment host;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IPhotoRepository photoRepository;
        private readonly IMapper mapper;
        private readonly IPhotoService iPhotoService;
        private readonly PhotoSettings photoSettings;

        public PhotosController(
            IHostingEnvironment host, 
            IVehicleRepository repository,
            IPhotoRepository photoRepository,
            IMapper mapper, 
            IOptionsSnapshot<PhotoSettings> options,
            IPhotoService iPhotoService)
        {
            this.mapper = mapper;
            this.iPhotoService = iPhotoService;
            this.vehicleRepository = repository;
            this.photoRepository = photoRepository;
            this.host = host;
            this.photoSettings = options.Value;
        }

        [HttpGet]    
        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await photoRepository.GetPhotos(vehicleId);
            return mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }

        [HttpPost]
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file)
        {
            var vehicle = await vehicleRepository.GetVehicle(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();
            if(file == null)
                return BadRequest("Not file is uploaded!");
            if(file.Length == 0)
                return BadRequest("Please upload a non-empty file!");
            if(file.Length > this.photoSettings.MaxFileSize)
                return BadRequest("Please upload a file with maximum size of 1GB!");
            if(!this.photoSettings.IsFileTypeSupported(file.FileName))
                return BadRequest("Please upload an image with extensions of '.jpg', 'jpeg' or '.png'!");

            var uploadFolderPath = Path.Combine(host.WebRootPath, "uploads");
            var photo = await this.iPhotoService.UploadPhoto(vehicle, file, uploadFolderPath);

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }
    }
}