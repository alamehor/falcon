import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { PaymentMethodListQuery } from '@deity/falcon-shop-data';
import { TwoStepWizard, SetPaymentMethod } from '@deity/falcon-front-kit';
import { ErrorSummary } from '@deity/falcon-ui-kit';
import { Text, Button } from '@deity/falcon-ui';
import loadable from 'src/components/loadable';
import {
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

// Loading "PaymentMethodItem" component via loadable package
// to avoid premature import of Payment frontend-plugins and their dependencies on SSR
const PaymentMethodItem = loadable(() =>
  import(/* webpackChunkName: "checkout/payment-item" */ './components/PaymentMethodItem')
);

export class PaymentMethodSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { open, selectedPayment, onEditRequested } = this.props;
    let header;
    if (!open && selectedPayment) {
      header = (
        <I18n>
          {t => (
            <CheckoutSectionHeader
              title={t('checkout.payment')}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<Text fontWeight="bold">{selectedPayment.title}</Text>}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <CheckoutSectionHeader title={t('checkout.payment')} open={open} />}</I18n>;
    }

    return (
      <CheckoutSection open={open}>
        {header}
        {open && (
          <CheckoutSectionContentLayout>
            <PaymentMethodListQuery>
              {({ data: { paymentMethodList } }) => {
                if (paymentMethodList.length === 0) {
                  return (
                    <Text color="error" mb="sm">
                      <T id="checkout.noPaymentMethodsAvailable" />
                    </Text>
                  );
                }

                return (
                  <SetPaymentMethod>
                    {(setPayment, { error }) => (
                      <React.Fragment>
                        <TwoStepWizard>
                          {({ selectedOption, selectOption }) =>
                            paymentMethodList.map(method => (
                              <PaymentMethodItem
                                key={method.code}
                                {...method}
                                selectOption={code => {
                                  this.setState({});
                                  selectOption(code);
                                }}
                                selectedOption={selectedOption}
                                onPaymentDetailsReady={data => this.setState({ ...method, data })}
                              />
                            ))
                          }
                        </TwoStepWizard>
                        <CheckoutSectionFooter>
                          <Button disabled={!this.state.code} onClick={() => setPayment(this.state)}>
                            <T id="checkout.nextStep" />
                          </Button>
                          <ErrorSummary errors={error} />
                        </CheckoutSectionFooter>
                      </React.Fragment>
                    )}
                  </SetPaymentMethod>
                );
              }}
            </PaymentMethodListQuery>
          </CheckoutSectionContentLayout>
        )}
      </CheckoutSection>
    );
  }
}
PaymentMethodSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // currently selected payment method
  selectedPayment: PropTypes.shape({}),
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func
  // callback that sets selected payment method
};
