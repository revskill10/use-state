import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { NestedExample } from '../NestedExample';

export default {
  title: 'NestedExample',
  component: NestedExample,
  argTypes: {},
} as Meta<typeof NestedExample>;

const Template: StoryFn<typeof NestedExample> = (args) => (
  <NestedExample {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  address: {
    addressLine1: '123 Main St',
    addressLine2: 'Apt 1',
  },
  contact: {
    email: 'fGw0F@example.com',
    phone: '(555) 555-5555',
  },
};
