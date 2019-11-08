import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { Label, FlexLayout, Details, DetailsContent, Text, Radio, Box, Button } from '@deity/falcon-ui';
import { Price, ErrorSummary } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';

const ShippingSelector = ({ availableShippingOptions = [], onShippingSelected }) => (
  <Box my="md">
    {availableShippingOptions.map(option => (
      <FlexLayout key={option.carrierCode}>
        <Radio
          size="sm"
          id={`opt-${option.carrierCode}`}
          value={option.carrierCode}
          name="shipping"
          onChange={() => onShippingSelected(option)}
        />
        <Label mx="sm" flex="1" htmlFor={`opt-${option.carrierCode}`}>
          {`${option.carrierTitle} (${option.methodTitle}):`}
        </Label>
        <Price value={option.amount} />
      </FlexLayout>
    ))}
  </Box>
);

ShippingSelector.propTypes = {
  availableShippingOptions: PropTypes.arrayOf(PropTypes.shape({})),
  onShippingSelected: PropTypes.func
};

class ShippingSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShipping: null
    };
  }

  onShippingSelected = selectedShipping => this.setState({ selectedShipping });

  submitShipping = () => {
    const { methodCode: method, ...data } = this.state.selectedShipping;
    this.props.setShipping({ method, data });
  };

  render() {
    const { open, onEditRequested, availableShippingMethods, selectedShipping, errors } = this.props;
    let header;

    if (!open && selectedShipping) {
      header = (
        <I18n>
          {t => (
            <SectionHeader
              title={t('checkout.shipping')}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<Text>{selectedShipping.carrierTitle}</Text>}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <SectionHeader title={t('checkout.shipping')} />}</I18n>;
    }

    return (
      <Details open={open}>
        {header}
        <DetailsContent>
          {availableShippingMethods.length === 0 ? (
            <Text color="error" mb="sm">
              <T id="checkout.noShippingMethodsAvailable" />
            </Text>
          ) : (
            <ShippingSelector
              availableShippingOptions={availableShippingMethods}
              onShippingSelected={this.onShippingSelected}
            />
          )}
          <ErrorSummary errors={errors} />
          {availableShippingMethods.length > 0 && (
            <Button disabled={!this.state.selectedShipping} onClick={this.submitShipping}>
              <T id="continue" />
            </Button>
          )}
        </DetailsContent>
      </Details>
    );
  }
}

ShippingSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // all available shipping methods
  availableShippingMethods: PropTypes.arrayOf(PropTypes.shape({})),
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // currently selected shipping method
  selectedShipping: PropTypes.shape({}),
  // callback that sets selected shipping method
  setShipping: PropTypes.func,
  // errors passed from outside that should be displayed for this section
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string
    })
  )
};

export default ShippingSection;
