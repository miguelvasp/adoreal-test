using AppointmentsApi.Models;

namespace AppointmentsApi.Validation;

public static class AppointmentValidator
{
    public static Dictionary<string, string[]> Validate(CreateAppointmentRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(request.PatientName))
        {
            errors["patientName"] = new[] { "Patient name is required." };
        }

        if (request.StartsAt == default)
        {
            errors["startsAt"] = new[] { "StartsAt must be a valid date/time." };
        }

        return errors;
    }
}
