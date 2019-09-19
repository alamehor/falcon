import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { OperationInput } from '@deity/falcon-data';
import { ResetPasswordInput } from '@deity/falcon-shop-extension';

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export type ResetPasswordResponse = {
  resetPassword: boolean;
};

export class ResetPasswordMutation extends Mutation<ResetPasswordResponse, OperationInput<ResetPasswordInput>> {
  static defaultProps = {
    mutation: RESET_PASSWORD_MUTATION
  };
}