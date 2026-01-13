namespace AppointmentsApi.Models;

public sealed record Appointment(Guid Id, string PatientName, DateTime StartsAt, string? Notes);
