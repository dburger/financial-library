function testFinancialLibrary() {
  const failures = [];

  assert(failures, (val) => val > 15.0 && val < 40.0, finviz, "GOOG", 0, 3);
  assert(failures, 0.0003, yahooExpenseRatio, "VTI");
  assert(failures, (val) => val > 0, yahooVolume, "GOOG");
  assert(failures, (val) => val > 10000000 && val < 50000000, yahooAverageVolume, "GOOG");

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    MailApp.sendEmail("davidburger@gmail.com", "financial-library tests", failures.join("\n"));
  }
}

function assert(failures, expected, func, ...args) {
  try {
    const actual = func(...args);
    if (expected instanceof Function) {
      if (!expected(actual)) {
        failures.push(`${func.name} expected predicate failed.`);
      }
    } else if (actual !== expected) {
      failures.push(`${func.name} expected ${expected}, actual ${actual}.`);
    }
  } catch (exc) {
    failures.push(`${func.name} threw ${exc.message}`);
  }
}
