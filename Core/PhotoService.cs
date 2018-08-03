using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using vega.Core.Models;

namespace vega.Core
{
    public class PhotoService : IPhotoService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IPhotoStorage iPhotoStorage;

        public PhotoService(
            IUnitOfWork unitOfWork, 
            IPhotoStorage iPhotoStorage)
        {
            this.unitOfWork = unitOfWork;
            this.iPhotoStorage = iPhotoStorage;
        }
        public async Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadFolderPath)
        {

            var fileName = await this.iPhotoStorage.StorePhoto(file, uploadFolderPath);
            
            var photo = new Photo { FileName = fileName };
            vehicle.Photos.Add(photo);
            await unitOfWork.CompleteAsync();

            return photo;
        }
    }
}