using System.Collections.Generic;
using System.Threading.Tasks;
using vega.Core.Models;

namespace vega.Core
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>> GetVehicles();

        Task<Vehicle> GetVehicle(int id, bool includeRelated = true);

        void Add(Vehicle vehicle);

        void Remove(Vehicle vehicle);
    }
}