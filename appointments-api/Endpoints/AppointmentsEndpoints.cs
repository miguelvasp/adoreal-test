using AppointmentsApi.Data;
using AppointmentsApi.Models;
using AppointmentsApi.Validation;
using Microsoft.EntityFrameworkCore;

namespace AppointmentsApi.Endpoints;

public static class AppointmentsEndpoints
{
    public static IEndpointRouteBuilder MapAppointmentsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/appts", async (AppointmentsDbContext dbContext) =>
            {
                var appointments = await dbContext.Appointments
                    .AsNoTracking()
                    .OrderBy(appointment => appointment.StartsAt)
                    .Select(appointment => new Appointment(
                        appointment.Id,
                        appointment.PatientName,
                        appointment.StartsAt,
                        appointment.Notes))
                    .ToListAsync();

                return Results.Ok(appointments);
            })
            .WithName("GetAppointments");

        app.MapPost("/appts", async (CreateAppointmentRequest request, AppointmentsDbContext dbContext) =>
            {
                var validationErrors = AppointmentValidator.Validate(request);
                if (validationErrors.Count > 0)
                {
                    return Results.ValidationProblem(validationErrors);
                }

                var entity = new AppointmentEntity
                {
                    Id = Guid.NewGuid(),
                    PatientName = request.PatientName.Trim(),
                    StartsAt = request.StartsAt,
                    Notes = request.Notes?.Trim()
                };

                dbContext.Appointments.Add(entity);
                await dbContext.SaveChangesAsync();

                var appointment = new Appointment(entity.Id, entity.PatientName, entity.StartsAt, entity.Notes);
                return Results.Created($"/appts/{appointment.Id}", appointment);
            })
            .WithName("CreateAppointment");

        return app;
    }
}
