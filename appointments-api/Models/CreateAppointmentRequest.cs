namespace AppointmentsApi.Models;

public sealed record CreateAppointmentRequest(string PatientName, DateTime StartsAt, string? Notes);
