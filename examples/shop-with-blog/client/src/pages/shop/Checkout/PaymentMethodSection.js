import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { PaymentMethodListQuery } from '@deity/falcon-shop-data';
import { TwoStepWizard } from '@deity/falcon-front-kit';
import { ErrorSummary } from '@deity/falcon-ui-kit';
import { Details, DetailsContent, Text, Button } from '@deity/falcon-ui';
import loadable from 'src/components/loadable';
import SectionHeader from './CheckoutSectionHeader';

// Loading "PaymentMethodItem" component via loadable package
// to avoid premature import of Payment frontend-plugins and their dependencies on SSR
const PaymentMethodItem = loadable(() =>
  import(/* webpackChunkName: "checkout/payment-item" */ './components/PaymentMethodItem')
);

class PaymentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPayment: null,
      data: null
    };
  }

  onPaymentSelected = (selectedPayment, data) => this.setState({ selectedPayment, data });

  resetSelected = () => this.setState({ selectedPayment: null, data: null });

  submitPayment = () => {
    this.props.setPayment({
      method: this.state.selectedPayment.code,
      data: this.state.data
    });
  };

  render() {
    const { open, selectedPayment, onEditRequested, errors } = this.props;
    let header;
    if (!open && selectedPayment) {
      header = (
        <I18n>
          {t => (
            <SectionHeader
              title={t('checkout.payment')}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<Text>{selectedPayment.title}</Text>}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <SectionHeader title={t('checkout.payment')} />}</I18n>;
    }

    return (
      <Details open={open}>
        {header}
        {open && (
          <DetailsContent>
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
                  <React.Fragment>
                    <TwoStepWizard>
                      {({ selectedOption, selectOption }) =>
                        paymentMethodList.map(payment => (
                          <PaymentMethodItem
                            key={payment.code}
                            {...payment}
                            selectOption={code => {
                              this.resetSelected();
                              selectOption(code);
                            }}
                            selectedOption={selectedOption}
                            onPaymentDetailsReady={data => this.onPaymentSelected(payment, data)}
                          />
                        ))
                      }
                    </TwoStepWizard>
                    <Button disabled={!this.state.selectedPayment} onClick={this.submitPayment}>
                      <T id="continue" />
                    </Button>
                    <ErrorSummary errors={errors} />
                  </React.Fragment>
                );
              }}
            </PaymentMethodListQuery>
          </DetailsContent>
        )}
      </Details>
    );
  }
}

PaymentSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // all available payment methods
  availablePaymentMethods: PropTypes.arrayOf(PropTypes.shape({})),
  // currently selected payment method
  selectedPayment: PropTypes.shape({}),
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // callback that sets selected payment method
  setPayment: PropTypes.func,
  // errors passed from outside that should be displayed for this section
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string
    })
  )
};

export default PaymentSection;
