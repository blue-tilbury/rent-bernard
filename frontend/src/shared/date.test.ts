import moment from "moment";
import { describe, expect, it } from "vitest";

import { formatDate } from "./date";

describe("formatDate", () => {
  describe("when date is within 60 minutes", () => {
    it("returns the number of minutes ago", () => {
      const now = moment();
      // Subtract 30 seconds to make sure the date is between 30 and 31 minutes ago
      const date = moment().subtract(30, "minutes").subtract(30, "seconds");
      expect(formatDate(date, now)).toBe("30 mins ago");
    });
  });

  describe("when date is within 24 hours", () => {
    it("returns the number of hours ago", () => {
      const now = moment();
      // Subtract 30 minutes to make sure the date is between 5 and 6 hours ago
      const date = moment().subtract(5, "hours").subtract(30, "minutes");
      expect(formatDate(date, now)).toBe("5h ago");
    });
  });

  describe("when date is more than 24 hours ago", () => {
    it("returns the date in YYYY/MM/DD format", () => {
      const now = moment();
      const date = moment().subtract(2, "days");
      expect(formatDate(date, now)).toBe(date.format("YYYY/MM/DD"));
    });
  });
});
