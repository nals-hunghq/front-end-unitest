describe('ENV', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should use the environment variable for BASE_URL if defined', async () => {
    process.env.BASE_URL = 'https://custom-base-url.com';
    const { ENV } = await import('@/env/env');
    expect(ENV.BASE_URL).toBe('https://custom-base-url.com');
  });

  it('should use the default value for BASE_URL if environment variable is not defined', async () => {
    delete process.env.BASE_URL;
    const { ENV } = await import('@/env/env');
    expect(ENV.BASE_URL).toBe('https://67eb7353aa794fb3222a4c0e.mockapi.io');
  });

  it('should use the environment variable for PAYMENT_URL if defined', async () => {
    process.env.PAYMENT_URL = 'https://custom-payment-url.com';
    const { ENV } = await import('@/env/env');
    expect(ENV.PAYMENT_URL).toBe('https://custom-payment-url.com');
  });

  it('should use the default value for PAYMENT_URL if environment variable is not defined', async () => {
    delete process.env.PAYMENT_URL;
    const { ENV } = await import('@/env/env');
    expect(ENV.PAYMENT_URL).toBe('https://payment.example.com/pay');
  });

  it('should handle both BASE_URL and PAYMENT_URL being undefined', async () => {
    delete process.env.BASE_URL;
    delete process.env.PAYMENT_URL;
    const { ENV } = await import('@/env/env');
    expect(ENV.BASE_URL).toBe('https://67eb7353aa794fb3222a4c0e.mockapi.io');
    expect(ENV.PAYMENT_URL).toBe('https://payment.example.com/pay');
  });

  it('should handle both BASE_URL and PAYMENT_URL being defined', async () => {
    process.env.BASE_URL = 'https://custom-base-url.com';
    process.env.PAYMENT_URL = 'https://custom-payment-url.com';
    const { ENV } = await import('@/env/env');
    expect(ENV.BASE_URL).toBe('https://custom-base-url.com');
    expect(ENV.PAYMENT_URL).toBe('https://custom-payment-url.com');
  });
});
