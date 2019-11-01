import React from 'react';
import { FlexLayout, Link } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { SignInFormProvider } from '@deity/falcon-front-kit';
import { ErrorSummary } from '../Error';
import { FormField, Form, FormProps, PasswordRevealInput, FormSubmit } from '../Forms';

export type SignInFormProps = Partial<FormProps> & {
  onSuccess?: () => Promise<void>;
  onForgotPassword: Function;
};

export const SignInForm: React.SFC<SignInFormProps> = ({ onSuccess, onForgotPassword, ...formProps }) => (
  <SignInFormProvider onSuccess={onSuccess}>
    {({ status = {} }) => (
      <Form i18nId="signIn" {...formProps}>
        <FormField name="email" type="email" required autoComplete="email" />
        <FormField
          name="password"
          type="password"
          // pass empty array, so default password strength validator does not get triggered
          validate={[]}
          required
          autoComplete="current-password"
        >
          {({ field }) => <PasswordRevealInput {...field} />}
        </FormField>
        <FlexLayout justifyContent="space-between" alignItems="center" mt="md">
          <Link fontSize="xs" onClick={() => onForgotPassword()}>
            <T id="signIn.forgotPasswordLink" />
          </Link>
          <FormSubmit />
        </FlexLayout>

        {status.error && <ErrorSummary errors={status.error} />}
      </Form>
    )}
  </SignInFormProvider>
);
