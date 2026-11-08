/**
 * Reference data: the shop's catalogue.
 *
 * This is the other kind of test data. Nobody creates or deletes products during a test,
 * so it is safe to share and safe to hard-code - in ONE place, here.
 * Users, carts and orders are different: every test makes its own (see factories.ts).
 */
export const PRODUCTS = {
  pliers: { id: 'p1', name: 'Combination Pliers', price: '$14.15' },
  hammer: { id: 'p2', name: 'Claw Hammer', price: '$12.58' },
  cutters: { id: 'p3', name: 'Bolt Cutters', price: '$48.41' },
  drill: { id: 'p4', name: 'Cordless Drill', price: '$89.55' },
} as const;
