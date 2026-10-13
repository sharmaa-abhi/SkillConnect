import assert from 'node:assert/strict';
import { getWeekdayName, formatDateDisplay, generateBookingDateOptions } from '../src/lib/dates';

console.log('--- RUNNING DATE AND WEEKDAY TESTS ---');

// Test 1: October 13, 2026 MUST be Tuesday, NOT Wednesday
const weekdayOct13 = getWeekdayName('2026-10-13');
assert.equal(weekdayOct13, 'Tuesday', 'CRITICAL: Oct 13, 2026 is Tuesday, NOT Wednesday!');
console.log(`✓ "2026-10-13" resolves to Tuesday: ${weekdayOct13}`);

const weekdayOct13Text = getWeekdayName('October 13, 2026');
assert.equal(weekdayOct13Text, 'Tuesday', 'Text date "October 13, 2026" must also resolve to Tuesday');
console.log(`✓ "October 13, 2026" resolves to Tuesday: ${weekdayOct13Text}`);

// Test 2: Month boundary transitions (Oct 31, 2026 -> Nov 1, 2026)
const oct31 = getWeekdayName('2026-10-31');
assert.equal(oct31, 'Saturday');
const nov1 = getWeekdayName('2026-11-01');
assert.equal(nov1, 'Sunday');
console.log('✓ Month boundary dates transition correctly (Oct 31 is Saturday, Nov 1 is Sunday)');

// Test 3: Year boundary transitions (Dec 31, 2026 -> Jan 1, 2027)
const dec31 = getWeekdayName('2026-12-31');
assert.equal(dec31, 'Thursday');
const jan1 = getWeekdayName('2027-01-01');
assert.equal(jan1, 'Friday');
console.log('✓ Year boundary dates transition correctly (Dec 31 is Thursday, Jan 1 is Friday)');

// Test 4: Display formatting with timezone
const displayDate = formatDateDisplay('2026-10-13', { includeWeekday: true, includeYear: true });
assert.equal(displayDate, 'Tuesday, Oct 13, 2026');
console.log(`✓ formatDateDisplay outputs clean standard format: "${displayDate}"`);

// Test 5: Dynamic booking date options generator
const bookingOptions = generateBookingDateOptions('2026-10-13', 5);
assert.equal(bookingOptions.length, 5);
assert.equal(bookingOptions[0].label, 'Today');
assert.equal(bookingOptions[0].subtext, 'Oct 13');
assert.equal(bookingOptions[0].weekday, 'Tuesday');

assert.equal(bookingOptions[1].label, 'Tomorrow');
assert.equal(bookingOptions[1].subtext, 'Oct 14');
assert.equal(bookingOptions[1].weekday, 'Wednesday');

assert.equal(bookingOptions[2].label, 'Thursday');
assert.equal(bookingOptions[2].subtext, 'Oct 15');
assert.equal(bookingOptions[2].weekday, 'Thursday');

assert.equal(bookingOptions[3].label, 'Friday');
assert.equal(bookingOptions[3].subtext, 'Oct 16');
assert.equal(bookingOptions[3].weekday, 'Friday');

assert.equal(bookingOptions[4].label, 'Saturday');
assert.equal(bookingOptions[4].subtext, 'Oct 17');
assert.equal(bookingOptions[4].weekday, 'Saturday');

console.log('✓ generateBookingDateOptions dynamically computes weekdays matching calendar math with zero hardcoding');

console.log('ALL DATE AND WEEKDAY TESTS PASSED!\n');
