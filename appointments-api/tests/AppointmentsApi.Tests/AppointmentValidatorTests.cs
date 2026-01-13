using AppointmentsApi.Models;
using AppointmentsApi.Validation;
using Xunit;

namespace AppointmentsApi.Tests;

public class AppointmentValidatorTests
{
    [Fact]
    public void Validate_ReturnsErrors_WhenFieldsMissing()
    {
        var request = new CreateAppointmentRequest("", default, null);

        var errors = AppointmentValidator.Validate(request);

        Assert.Contains("patientName", errors.Keys);
        Assert.Contains("startsAt", errors.Keys);
    }

    [Fact]
    public void Validate_ReturnsNoErrors_WhenValid()
    {
        var request = new CreateAppointmentRequest("Ana Silva", DateTime.UtcNow.AddHours(1), "Note");

        var errors = AppointmentValidator.Validate(request);

        Assert.Empty(errors);
    }
}
