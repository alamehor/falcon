import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Country } from '@deity/falcon-shop-extension';

export const GET_COUNTRY_LIST = gql`
  query CountryList {
    countryList {
      items {
        id
        code
        englishName
        localName
      }
    }
  }
`;

export type CountryListResponse = {
  countryList: {
    items: Pick<Country, 'id' | 'code' | 'localName' | 'englishName'>[];
  };
};

export class CountryListQuery extends Query<CountryListResponse> {
  static defaultProps = {
    query: GET_COUNTRY_LIST
  };
}
