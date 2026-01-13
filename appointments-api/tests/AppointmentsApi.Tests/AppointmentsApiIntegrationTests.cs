using AppointmentsApi.Models;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace AppointmentsApi.Tests;

public class AppointmentsApiIntegrationTests : IClassFixture<AppointmentsApiFactory>
{
    private readonly HttpClient _client;

    public AppointmentsApiIntegrationTests(AppointmentsApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAppointments_ReturnsOk()
    {
        var response = await _client.GetAsync("/appts");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostAppointments_ReturnsBadRequest_WhenInvalid()
    {
        var payload = new { patientName = "", startsAt = default(DateTime), notes = (string?)null };

        var response = await _client.PostAsJsonAsync("/appts", payload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostAppointments_ReturnsCreated_WhenValid()
    {
        var payload = new { patientName = "Maria Costa", startsAt = DateTime.UtcNow.AddDays(1), notes = "Primeira consulta" };

        var response = await _client.PostAsJsonAsync("/appts", payload);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var appointment = await response.Content.ReadFromJsonAsync<Appointment>();
        Assert.NotNull(appointment);
        Assert.NotEqual(Guid.Empty, appointment!.Id);
    }
}
