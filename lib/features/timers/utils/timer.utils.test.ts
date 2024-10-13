import {
  calculateSecondsLeft,
  durationMSToTimer,
  formatDurationFromMilliseconds,
} from "./timer.utils";

describe("Timer utils", () => {
  describe("calculateSecondsLeft", () => {
    it("should return the correct number of seconds left", () => {
      const timer = {
        updated_at: new Date().valueOf(),
        duration_ms: 10000,
      };

      const result = calculateSecondsLeft(timer);

      expect(result).toBe(10);
    });
  });

  describe("formatDurationFromMilliseconds", () => {
    it("should return the correct formatted days duration", () => {
      const result = formatDurationFromMilliseconds(86400000);

      expect(result).toBe("1 day");
    });
    it("should return the correct formatted hours duration", () => {
      const result = formatDurationFromMilliseconds(3600000);

      expect(result).toBe("1 hour");
    });

    it("should return the correct formatted minutes duration", () => {
      const result = formatDurationFromMilliseconds(60000);

      expect(result).toBe("1 minute");
    });

    it("should return the correct formatted seconds duration", () => {
      const result = formatDurationFromMilliseconds(1000);

      expect(result).toBe("1 second");
    });
    it("should return the correct formatted duration of a generic duration", () => {
      const result = formatDurationFromMilliseconds(123456789);

      expect(result).toBe("1 day 10 hours");
    });
  });

  describe("durationMSToTimer", () => {
    it("should return the correct timer object", () => {
      const testValues = [1000, 1000 * 60, 1000 * 60 * 60, 1000 * 60 * 60 * 24];

      const results = testValues.map(durationMSToTimer);

      expect(results).toEqual([
        { days: 0, hours: 0, minutes: 0 },
        { days: 0, hours: 0, minutes: 1 },
        { days: 0, hours: 1, minutes: 0 },
        { days: 1, hours: 0, minutes: 0 },
      ]);
    });
  });
});
