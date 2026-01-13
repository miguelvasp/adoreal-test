namespace Patterns.FactoryMethod
{
    public abstract class Creator<T>
    {
        protected abstract T Create();

        public virtual T Operation()
        {
            var instance = Create();
            return instance;
        }
    }

    public sealed class DelegateCreator<T> : Creator<T>
    {
        private readonly Func<T> _factory;

        public DelegateCreator(Func<T> factory)
            => _factory = factory ?? throw new ArgumentNullException(nameof(factory));

        protected override T Create() => _factory();
    }

    public sealed class DelegateCreator<T, TArg> : Creator<T>
    {
        private readonly Func<TArg, T> _factory;
        private readonly TArg _arg;

        public DelegateCreator(Func<TArg, T> factory, TArg arg)
        {
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
            _arg = arg;
        }

        protected override T Create() => _factory(_arg);
    }
}
