using Patterns.FactoryMethod;


internal static class Program
{
    private static void Main()
    {
        Console.WriteLine("Factory Method (generic) demo\n");

        //Simple sample using Guid
        var guidCreator = new DelegateCreator<Guid>(() => Guid.NewGuid());
        var id1 = guidCreator.Operation();

        Console.WriteLine($"Guid #1: {id1}");


        // HttpClient
        var httpClientCreator = new DelegateCreator<HttpClient>(() =>
        {
            var client = new HttpClient
            {
                BaseAddress = new Uri("https://www.adoreal.com/en"),
                Timeout = TimeSpan.FromSeconds(10)
            };
            client.DefaultRequestHeaders.UserAgent.ParseAdd("FactoryMethodDemo/1.0");
            return client;
        });

        using var clientInstance = httpClientCreator.Operation();
        Console.WriteLine($"HttpClient BaseAddress: {clientInstance.BaseAddress}");
        Console.WriteLine($"HttpClient Timeout: {clientInstance.Timeout}\n");
    }
}
