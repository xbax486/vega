using System;
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
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly PhotoSettings photoSettings;

        public PhotosController(
            IHostingEnvironment host, IVehicleRepository repository, 
            IUnitOfWork unitOfWork, IMapper mapper, IOptionsSnapshot<PhotoSettings> options)
        {
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.host = host;
            this.photoSettings = options.Value;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file)
        {
            var vehicle = await repository.GetVehicle(vehicleId, includeRelated: false);
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

            var uploadFoldersPath = Path.Combine(host.WebRootPath, "uploads");
            if (!Directory.Exists(uploadFoldersPath))
                Directory.CreateDirectory(uploadFoldersPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFoldersPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photo = new Photo { FileName = fileName };
            vehicle.Photos.Add(photo);
            await unitOfWork.CompleteAsync();

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }
    }
}