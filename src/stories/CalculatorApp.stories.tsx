import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { CalculatorApp as Example } from '../examples/CalculatorApp';

export default {
  title: 'CalculatorApp',
  component: Example,
  argTypes: {},
} as Meta<typeof Example>;

const Template: StoryFn<typeof Example> = () => <Example />;

export const Primary = Template.bind({});

Primary.args = {};
