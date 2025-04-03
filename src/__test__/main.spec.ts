import { setupCounter } from '@/counter';

beforeAll(async () => {
  document.body.innerHTML = `
    <div id="app"></div>
  `;

  await import('@/main');
});

vi.mock('@/counter.ts', () => ({
  setupCounter: vi.fn(),
}));

describe('main.ts', () => {
  it('should render the app content correctly', () => {
    const app = document.querySelector<HTMLDivElement>('#app');
    expect(app).not.toBeNull();
    expect(app!.innerHTML).toContain('<h1>Vite + TypeScript</h1>');
    expect(app!.innerHTML).toContain('Click on the Vite and TypeScript logos to learn more');
  });

  it('should call setupCounter with the correct button element', () => {
    const counterButton = document.querySelector<HTMLButtonElement>('#counter');
    expect(counterButton).not.toBeNull();
    expect(setupCounter).toHaveBeenCalledWith(counterButton);
  });
});
