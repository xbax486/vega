using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core.Models;
using vega.Core;
using System.Collections.Generic;
using System.Linq;

namespace vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;

        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetVehicles(VehicleQuery vehicleQuery)
        {
            var query = context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.VehicleFeatures)
                    .ThenInclude(vf => vf.Feature)
                .AsQueryable();

            if(vehicleQuery.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == vehicleQuery.MakeId.Value);
            if(vehicleQuery.ModelId.HasValue)
                query = query.Where(v => v.ModelId == vehicleQuery.ModelId.Value);

            return await query.ToListAsync();
        }

        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true) 
        {
            if(!includeRelated)
                return await context.Vehicles.FindAsync(id);
            

            return await context.Vehicles
                .Include(v => v.VehicleFeatures)
                .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                .ThenInclude(m => m.Make)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void Remove(Vehicle vehicle)
        {
            context.Vehicles.Remove(vehicle);
        }
    }
}