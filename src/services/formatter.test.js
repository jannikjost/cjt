// import {
//   describe,
//   test,
//   expect,
//   beforeAll,
//   beforeEach,
//   afterEach,
//   vi,
// } from "vitest";
// import {
//   formatOvertime,
//   formatDateMonthYear,
//   formatDateDayMonthYear,
//   convertMinsToHrsMins,
// } from "./formatter";

// describe("formatOvertime", () => {
//   test("format 25", () => {
//     const timeToFormat = 25;
//     const expectedResult = "0:15";
//     const result = formatOvertime(timeToFormat);
//     expect(result).toBe(expectedResult);
//   });
//   test("format 5", () => {
//     const timeToFormat = 5;
//     const expectedResult = "0:30";
//     const result = formatOvertime(timeToFormat);
//     expect(result).toBe(expectedResult);
//   });
//   test("format 75", () => {
//     const timeToFormat = 75;
//     const expectedResult = "0:45";
//     const result = formatOvertime(timeToFormat);
//     expect(result).toBe(expectedResult);
//   });
//   test("format 90", () => {
//     const timeToFormat = 90;
//     const expectedResult = "1:30";
//     const result = formatOvertime(timeToFormat);
//     expect(result).toBe(expectedResult);
//   });
// });

// describe("formatDateMonthYear", () => {
//   test("date", () => {
//     const startDate = new Date(1);
//     const expectedResult = "January 1970";
//     const result = formatDateMonthYear(startDate);
//     expect(result).toBe(expectedResult);
//   });
// });

// describe("formatDateDayMonthYear", () => {
//   test("date", () => {
//     const startDate = new Date(1);
//     const expectedResult = "01 January 1970";
//     const result = formatDateDayMonthYear(startDate);
//     expect(result).toBe(expectedResult);
//   });
// });

// describe("convertMinsToHrsMins", () => {
//   test("convert 75", () => {
//     const startDate = 75;
//     const expectedResult = "01:15";
//     const result = convertMinsToHrsMins(startDate);
//     expect(result).toBe(expectedResult);
//   });
//   test("convert 90", () => {
//     const startDate = 90;
//     const expectedResult = "01:30";
//     const result = convertMinsToHrsMins(startDate);
//     expect(result).toBe(expectedResult);
//   });
//   test("convert 105", () => {
//     const startDate = 105;
//     const expectedResult = "01:45";
//     const result = convertMinsToHrsMins(startDate);
//     expect(result).toBe(expectedResult);
//   });
// });
