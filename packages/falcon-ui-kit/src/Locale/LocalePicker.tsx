import React from 'react';
import PropTypes from 'prop-types';
import { themed, Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem, ThemingProps } from '@deity/falcon-ui';
import { LocaleItem } from '@deity/falcon-front-kit';

export type LocalePickerProps = ThemingProps & {
  items: LocaleItem[];
  value: LocaleItem;
  onChange?: (x: LocaleItem) => any;
};

export const LocalePickerInnerDOM: React.SFC<LocalePickerProps> = ({ items, value, ...rest }) => (
  <Dropdown {...rest}>
    <DropdownLabel>{value.name}</DropdownLabel>
    <DropdownMenu variant="above">
      {items.map(x => (
        <DropdownMenuItem key={x.code} value={x}>
          {x.name}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  </Dropdown>
);
LocalePickerInnerDOM.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.exact({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func
};

export const LocalePicker = themed<LocalePickerProps>({
  tag: LocalePickerInnerDOM,
  defaultTheme: {
    localePicker: {}
  }
});
