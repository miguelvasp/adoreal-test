using Microsoft.EntityFrameworkCore;

namespace AppointmentsApi.Data;

public sealed class AppointmentsDbContext : DbContext
{
    public AppointmentsDbContext(DbContextOptions<AppointmentsDbContext> options)
        : base(options)
    {
    }

    public DbSet<AppointmentEntity> Appointments => Set<AppointmentEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppointmentEntity>(entity =>
        {
            entity.ToTable("Appointments");
            entity.HasKey(appointment => appointment.Id);
            entity.Property(appointment => appointment.PatientName)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(appointment => appointment.StartsAt)
                .IsRequired();
            entity.Property(appointment => appointment.Notes)
                .HasMaxLength(500);
        });
    }
}
