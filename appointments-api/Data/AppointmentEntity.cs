namespace AppointmentsApi.Data;

public sealed class AppointmentEntity
{
    public Guid Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime StartsAt { get; set; }
    public string? Notes { get; set; }
}
