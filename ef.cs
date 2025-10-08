using Microsoft.EntityFrameworkCore;
using Invoices.Api;
using Invoices.Api.DTOs;
using Invoices.Api.Entities;
using Invoices.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("invoices-db")));

builder.Services.AddScoped<InvoiceService>();

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Apply database migrations
    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    db.Database.Migrate();
}

app.UseHttpsRedirection();

// Invoice endpoints
app.MapGet("/invoices/{companyId}/unoptimized", async (
    long companyId,
    InvoiceService invoiceService,
    ApplicationDbContext context) =>
{
    var invoices = invoiceService.GetByCompanyId(companyId);

    var invoiceDtos = new List<InvoiceDto>();
    foreach (var invoice in invoices)
    {
        var invoiceDto = new InvoiceDto
        {
            Id = invoice.Id,
            CompanyId = invoice.CompanyId,
            IssuedDate = invoice.IssuedDate,
            DueDate = invoice.DueDate,
            Number = invoice.Number
        };

        var lineItemDtos = await context
            .LineItems
            .Where(li => invoice.LineItemIds.Contains(li.Id))
            .Select(li => new LineItemDto
            {
                Id = li.Id,
                Name = li.Name,
                Price = li.Price,
                Quantity = li.Quantity
            })
            .ToArrayAsync();

        invoiceDto.LineItems = lineItemDtos;
        invoiceDtos.Add(invoiceDto);
    }

    return invoiceDtos;
})
.WithName("GetInvoicesUnoptimized");

app.MapGet("/invoices/{companyId}/optimized", async (
    long companyId,
    InvoiceService invoiceService,
    ApplicationDbContext context) =>
{
    var invoices = invoiceService.GetByCompanyId(companyId);

    var lineItemIds = invoices
        .SelectMany(i => i.LineItemIds)
        .Distinct()
        .ToArray();

    var lineItemDtos = await context
        .LineItems
        .Where(li => lineItemIds.Contains(li.Id))
        .Select(li => new LineItemDto
        {
            Id = li.Id,
            Name = li.Name,
            Price = li.Price,
            Quantity = li.Quantity
        })
        .ToArrayAsync();

    var lineItemsDictionary = lineItemDtos.ToDictionary(li => li.Id);

    var invoiceDtos = new List<InvoiceDto>();
    foreach (var invoice in invoices)
    {
        var invoiceDto = new InvoiceDto
        {
            Id = invoice.Id,
            CompanyId = invoice.CompanyId,
            IssuedDate = invoice.IssuedDate,
            DueDate = invoice.DueDate,
            Number = invoice.Number,
            LineItems = invoice.LineItemIds
                .Select(id => lineItemsDictionary.TryGetValue(id, out var lineItem) ? lineItem : null)
                .Where(li => li != null)
                .ToArray()
        };
        invoiceDtos.Add(invoiceDto);
    }

    return invoiceDtos;
})
.WithName("GetInvoicesOptimized");

app.MapPost("/seed-data", async (ApplicationDbContext context) =>
{
    // Check if data already exists
    if (await context.LineItems.AnyAsync())
    {
        return Results.Ok("Data already seeded");
    }

    // Seed line items
    var lineItems = Enumerable.Range(1, 1000)
        .Select(i => new LineItem
        {
            Id = i,
            Name = $"Product {i}",
            Price = Random.Shared.Next(10, 1000),
            Quantity = Random.Shared.Next(1, 100)
        })
        .ToList();

    context.LineItems.AddRange(lineItems);
    await context.SaveChangesAsync();

    return Results.Ok($"Seeded {lineItems.Count} line items");
})
.WithName("SeedData");

app.Run();
