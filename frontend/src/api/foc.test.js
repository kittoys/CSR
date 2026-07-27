import { getFocData } from "./foc";
import { getForecastOverview } from "./forecast";
import { setAuthSession } from "./auth";

describe("auth-aware report APIs", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.resetAllMocks();
  });

  it("sends the auth token when fetching FOC data", async () => {
    setAuthSession("petugas-token", { id: 2, role: "petugas" });
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    global.fetch = mockFetch;

    await getFocData();

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/foc",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer petugas-token",
        }),
      }),
    );
  });

  it("sends the auth token when fetching forecast overview", async () => {
    setAuthSession("petugas-token", { id: 2, role: "petugas" });
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ overview: {} }),
    });
    global.fetch = mockFetch;

    await getForecastOverview();

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/forecast/overview",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer petugas-token",
        }),
      }),
    );
  });
});
