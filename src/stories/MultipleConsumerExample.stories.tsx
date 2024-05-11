import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { MultipleConsumerExample } from '../examples/MultipleConsumerExample';

export default {
  title: 'MultipleConsumerExample',
  component: MultipleConsumerExample,
  argTypes: {},
} as Meta<typeof MultipleConsumerExample>;

const Template: StoryFn<typeof MultipleConsumerExample> = () => (
  <MultipleConsumerExample />
);

export const Primary = Template.bind({});

Primary.args = {};
