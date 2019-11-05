import { Address } from '@deity/falcon-shop-extension';

export const addressToString = (address: Address) =>
  [
    address.company,
    `${address.firstname} ${address.lastname}`,
    address.street && `${address.street.join(' ')}`,
    `${address.postcode} ${address.city}, ${address.country.code}`
  ]
    .filter(x => x)
    .join(', ');
