using System.Collections.Generic;
using System.Threading.Tasks;
using vega.Core.Models;

namespace vega.Core
{
    public interface IPhotoRepository
    {
        Task<ICollection<Photo>> GetPhotos(int vehicleId);

        void Remove(Photo photo);
    }
}