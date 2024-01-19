function testFinancialLibrary() {
  const failures = [];

  assert(failures, 27.08, finviz, "GOOG", 0, 3);
  assert(failures, 0.0003, yahooExpenseRatio, "VTI");
  assert(failures, 6709857, yahooVolume, "GOOG");
  assert(failures, 1.0, yahooAverageVolume, "GOOG");

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    MailApp.sendEmail("davidburger@gmail.com", "financial-library tests", failures.join("\n"));
  }
}

function assert(failures, expected, func, ...args) {
  try {
    const actual = func(...args);
    if (actual !== expected) {
      failures.push(`${func.name} expected ${expected}, actual ${actual}.`);
    }
  } catch (exc) {
    failures.push(`${func.name} threw ${exc.message}`);
  }
}
