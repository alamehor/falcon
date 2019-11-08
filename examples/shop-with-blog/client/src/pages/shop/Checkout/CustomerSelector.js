import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { Formik, Form } from 'formik';
import { SignOutMutation, GET_CUSTOMER } from '@deity/falcon-shop-data';
import { Box, Text, Link, Button, Details, DetailsContent } from '@deity/falcon-ui';
import { FormField, ErrorSummary, toGridTemplate } from '@deity/falcon-ui-kit';
import { I18n, T } from '@deity/falcon-i18n';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';
import SectionHeader from './CheckoutSectionHeader';

const customerEmailFormLayout = {
  customerEmailFormLayout: {
    display: 'grid',
    my: 'xs',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'],
        ['input'],
        ['button']
      ]),
      md: toGridTemplate([
        ['2fr', '1fr'],
        ['input', 'button']
      ])
    }
  }
};

const EmailForm = ({ email = '', setEmail }) => (
  <Formik initialStatus={{}} initialValues={{ email }} onSubmit={values => setEmail(values.email)}>
    {({ status: { error }, errors }) => (
      <Form>
        <Box defaultTheme={customerEmailFormLayout}>
          <Box gridArea="input">
            <FormField name="email" required type="email" autoComplete="email" />
          </Box>
          <Button gridArea="button" disabled={errors.email} type="submit">
            <T id="customerSelector.guestContinue" />
          </Button>
          {error && <ErrorSummary errors={error} />}
        </Box>
      </Form>
    )}
  </Formik>
);

EmailForm.propTypes = {
  setEmail: PropTypes.func.isRequired,
  email: PropTypes.string
};

class EmailSection extends React.Component {
  constructor(props) {
    super(props);

    let email = props.email || '';

    if (props.data && props.data.customer) {
      ({ email } = props.data.customer);
      props.setEmail(email);
    }

    this.state = {
      email: props.email,
      getPrevProps: () => this.props
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      data: { customer: prevCustomer }
    } = prevState.getPrevProps();
    const {
      data: { customer: nextCustomer }
    } = nextProps;

    const { email: prevCustomerEmail } = prevCustomer || {};
    const { email: nextCustomerEmail } = nextCustomer || {};

    if (prevCustomerEmail !== nextCustomerEmail) {
      // user has signed in or out so we have to trigger setEmail() with the new value
      nextProps.setEmail(nextCustomerEmail);

      // if there's no email in nextProps then customer just signed out - in that case we trigger
      // edit process so wizard switches to correct section
      if (!nextCustomerEmail) {
        nextProps.onEditRequested();
      }

      return {
        ...prevState,
        email: nextCustomerEmail || ''
      };
    }

    if (nextProps.email && nextProps.email !== prevState.email) {
      return {
        ...prevState,
        email: nextProps.email
      };
    }

    return null;
  }

  render() {
    const { open, data, onEditRequested } = this.props;
    const isSignedIn = !!data.customer;

    const content = (
      <OpenSidebarMutation>
        {openSidebar => (
          <Box>
            <Text>
              <T id="customerSelector.guestPrompt" />
            </Text>
            <EmailForm email={this.state.email} setEmail={this.props.setEmail} />
            <Text>
              <T id="customerSelector.or" />
              <Link
                mx="xs"
                color="primary"
                onClick={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.account } })}
              >
                <T id="customerSelector.signInLink" />
              </Link>
              <T id="customerSelector.ifAlreadyRegistered" />
            </Text>
          </Box>
        )}
      </OpenSidebarMutation>
    );

    return (
      <I18n>
        {t => (
          <Details open={open}>
            {open ? (
              <SectionHeader title={t('customerSelector.title')} />
            ) : (
              <SignOutMutation>
                {signOut => (
                  <SectionHeader
                    title={t('customerSelector.title')}
                    editLabel={t(isSignedIn ? 'customerSelector.signOut' : 'customerSelector.edit')}
                    onActionClick={isSignedIn ? signOut : onEditRequested}
                    complete
                    summary={<Text>{this.state.email}</Text>}
                  />
                )}
              </SignOutMutation>
            )}
            {content ? <DetailsContent>{content}</DetailsContent> : null}
          </Details>
        )}
      </I18n>
    );
  }
}

EmailSection.propTypes = {
  // data form GET_CUSTOMER query
  data: PropTypes.shape({}),
  // currently selected email
  email: PropTypes.string,
  // callback that sets email
  setEmail: PropTypes.func.isRequired,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag that indicates if the section is currently open
  open: PropTypes.bool
};

EmailSection.defaultProps = {
  email: ''
};

export default graphql(GET_CUSTOMER)(EmailSection);
