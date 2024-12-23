/** Binary string comparison function, without locale
 * Because ".localeCompare" function takes locale into account,
 * which is "cs" in my case and it fked me up in y2024d23 for 30 minutes
 * @param a string
 * @param b string
 *
 * @example
 * const arr = ['c','cx','h','hx','ch'];
 * arr.sort(stringSort)                             => [ 'c', 'ch', 'cx', 'h', 'hx' ] // okay
 * arr.sort((a, b) => a.localeCompare(b, 'cs'))     => [ 'c', 'cx', 'h', 'hx', 'ch' ] // not okay but default on my pc
 * arr.sort((a, b) => a.localeCompare(b, 'en'))     => [ 'c', 'ch', 'cx', 'h', 'hx' ] // okay
 */
export const stringSort = (a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0);
export const stringSortDesc = (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0);